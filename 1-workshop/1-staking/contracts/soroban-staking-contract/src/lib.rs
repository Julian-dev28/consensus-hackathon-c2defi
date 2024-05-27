// The standard library is disabled to optimize the contract for low-resource environments like blockchain.
#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, vec, Address, BytesN, Env, IntoVal, Vec};

// The DataKey enum is used to represent state variables stored in the contract's storage.
// This allows for structured access to data within the contract's storage.
#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Contributions(Address),
    Contributors,
    Token,
    ShareToken,
    IsActive,
    Admin,
    Initialized,
}

// The `#[contract]` attribute marks a type as being the type that contract functions are attached for.
#[contract]
pub struct StakingContract;

// The `#[contractimpl]` exports the publicly accessible functions to the Soroban environment.
#[contractimpl]
impl StakingContract {
    /// Initialize the contract with the admin address and the deposit token contract address.
    /// Deploys the share token contract and initializes it.
    ///
    /// # Arguments
    /// - `env` - The execution environment of the contract.
    /// - `admin` - The address of the admin.
    /// - `token_wasm_hash` - The hash of the token contract wasm.
    /// - `token` - The address of the deposit token contract.
    pub fn initialize(env: Env, admin: Address, token_wasm_hash: BytesN<32>, token: Address) {
        // Sets the admin address in the storage.
        env.storage().instance().set(&DataKey::Admin, &admin);
        // Deploys the share token contract.
        let share_contract = token::create_contract(&env, token_wasm_hash, &token);
        // Initializes the share token contract.
        token::Client::new(&env, &share_contract).initialize(
            &env.current_contract_address(),
            &18u32,
            &"Share Token".into_val(&env),
            &"SHARE".into_val(&env),
        );
        // Sets the token and share token addresses in the storage.
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage()
            .instance()
            .set(&DataKey::ShareToken, &share_contract);
        // Sets the initialized status to initialized.
        env.storage().instance().set(&DataKey::Initialized, &true);
    }

    /// Start a staking campaign
    /// # Arguments
    /// - `env` - The execution environment of the contract.
    /// - `admin` - The address of the admin.
    pub fn start_campaign(env: Env, admin: Address) {
        admin.require_auth();

        let current_admin = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or(env.current_contract_address());

        assert!(admin == current_admin);
        env.storage().instance().set(&DataKey::IsActive, &true);
    }

    /// Stop a staking campaign
    /// # Arguments
    /// - `env` - The execution environment of the contract.
    /// - `admin` - The address of the admin.
    ///
    pub fn stop_campaign(env: Env, admin: Address) {
        admin.require_auth();

        let current_admin = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or(env.current_contract_address());

        assert!(admin == current_admin);
        env.storage().instance().set(&DataKey::IsActive, &false);
    }

    /// Get the status of the staking campaign
    pub fn check_campaign_status(env: Env) -> bool {
        env.storage()
            .instance()
            .get(&DataKey::IsActive)
            .unwrap_or(false)
    }

    // Add staking interaction functions

    /// Records a deposit made by a contributor if the staking is active.
    /// # Arguments
    ///
    /// - `env` - The execution environment of the contract.
    /// - `contributor` - The address of the contributor making the contribution.
    /// - `token` - The address of the token to deposit.
    /// - `amount` - The amount of contribution in tokens.
    pub fn deposit(env: Env, contributor: Address, token: Address, amount: i128) {
        contributor.require_auth();
        // import Status enum from staking module
        let is_active: bool = Self::check_campaign_status(env.clone());
        if is_active != true {
            panic!("campaign is inactive");
        }
        if !Self::is_contributor(env.clone(), contributor.clone()) {
            Self::add_contributor(env.clone(), contributor.clone());
        }
        // Transfer the tokens to the contract
        token::Client::new(&env, &token).transfer(
            &contributor,
            &env.current_contract_address(),
            &amount,
        );
        // Mint the share token to the contributor
        let share_token = Self::get_share_token(env.clone());
        token::Client::new(&env, &share_token).mint(&contributor, &amount);
        // Update the contribution in the storage
        Self::set_contribution(env.clone(), contributor.clone(), amount);
    }

    /// Withdraws the contribution made by a contributor if the staking is active.
    ///
    /// # Arguments
    /// - `env` - The execution environment of the contract.
    /// - `contributor` - The address of the contributor making the contribution.
    /// - `amount` - The amount of contribution in tokens.
    /// - `token` - The address of the token to withdraw.
    /// - `recipient` - The address of the recipient of the contribution.
    pub fn withdraw(env: Env, contributor: Address, recipient: Address, token: Address) {
        contributor.require_auth();
        // import Status enum from staking module
        let is_active = Self::check_campaign_status(env.clone());
        if is_active != true {
            panic!("campaign is not activated");
        }
        if !Self::is_contributor(env.clone(), contributor.clone()) {
            panic!("contributor has not contributed");
        }
        let contribution = Self::get_user_contribution(env.clone(), contributor.clone());
        // Transfer the contribution to the recipient
        token::Client::new(&env, &token).transfer(
            &env.current_contract_address(),
            &recipient,
            &contribution,
        );
        // Burn the share token
        let share_token = Self::get_share_token(env.clone());
        token::Client::new(&env, &share_token).burn(&contributor, &contribution);

        // Clear the contributor from the storage
        Self::clear_contributor(env.clone(), contributor.clone());
    }

    /// Clear the contributor from the storage
    pub fn clear_contributor(env: Env, contributor: Address) {
        env.storage()
            .instance()
            .remove(&DataKey::Contributions(contributor));
    }

    // Get a users total contribution
    pub fn get_user_contribution(env: Env, contributor: Address) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::Contributions(contributor))
            .unwrap_or(0)
    }

    // Set a users contribution
    pub fn set_contribution(env: Env, contributor: Address, amount: i128) {
        env.storage()
            .instance()
            .set(&DataKey::Contributions(contributor), &amount);
    }

    // Get the list of contributors
    pub fn get_contributors(env: Env) -> Vec<Address> {
        env.storage()
            .instance()
            .get(&DataKey::Contributors)
            .unwrap_or(vec![&env, env.current_contract_address()])
    }

    // Get the total contributions
    pub fn get_total_contributions(env: Env) -> i128 {
        let contributors = Self::get_contributors(env.clone());
        let mut total = 0;
        for contributor in contributors.iter() {
            total += Self::get_user_contribution(env.clone(), contributor.clone());
        }
        total
    }

    // Get the ShareToken address
    pub fn get_share_token(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::ShareToken)
            .unwrap_or(env.current_contract_address())
    }

    // Get user's share balance
    pub fn get_share_token_balance(env: Env, user: Address) -> i128 {
        let share_token = Self::get_share_token(env.clone());
        token::Client::new(&env, &share_token).balance(&user)
    }

    /// Helper function to add a new contributor to the storage.
    fn add_contributor(env: Env, contributor: Address) {
        let mut contributors = env
            .storage()
            .instance()
            .get(&DataKey::Contributors)
            .unwrap_or(vec![&env, contributor.clone()]);
        contributors.push_back(contributor);
        env.storage()
            .instance()
            .set(&DataKey::Contributors, &contributors);
    }

    // Check if a user is a contributor
    fn is_contributor(env: Env, contributor: Address) -> bool {
        env.storage()
            .instance()
            .get(&DataKey::Contributions(contributor))
            .unwrap_or(0)
            > 0
    }
    // Add a new admin
    pub fn add_new_admin(env: Env, new_admin: Address) {
        Self::update_admin(env, new_admin);
    }

    // Sets the new admin address in the storage.
    fn update_admin(env: Env, new_admin: Address) {
        let current_admin = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or(env.current_contract_address());
        current_admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &new_admin);
    }

    // Get the admin address
    pub fn get_admin(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or(env.current_contract_address())
    }
}

// imports Token module
mod token;

// unit tests for the contract.
mod test;
