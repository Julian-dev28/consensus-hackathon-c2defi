// The standard library is disabled to optimize the contract for low-resource environments like blockchain.
#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, vec, Address, BytesN, Env, IntoVal, Vec};

// The DataKey enum is used to represent state variables stored in the contract's storage.
// This counter is used to track a specific value, such as the number of actions performed.
#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Counter,
}

// The `#[contract]` attribute marks a type as being the type that contract functions are attached for.
#[contract]
pub struct IncrementContract;

// The `#[contractimpl]` exports the publicly accessible functions to the Soroban environment.
#[contractimpl]
impl IncrementContract {
    /// Increments an internal counter and returns the new count.
    pub fn increment(env: Env, user: Address) -> u32 {
        // Requires the caller to be the wallet making the transaction.
        user.require_auth();
        // Retrieves the current value of the counter.
        let mut count: u32 = env.storage().instance().get(&DataKey::Counter).unwrap_or(0);
        // Increments the counter by 1.
        count += 1;
        // Stores the new count in the contract's storage.
        env.storage().instance().set(&DataKey::Counter, &count);
        // Extends the time-to-live of the counter by 100 blocks.
        env.storage().instance().extend_ttl(50, 100);
        // Returns the new count.
        count
    }

    // Retrieves the current value of the counter.
    pub fn get_count(env: Env) -> u32 {
        // Retrieves the current value of the counter.
        env.storage().instance().get(&DataKey::Counter).unwrap_or(0)
    }

    // Add the Campaign contract
    // Initialize the contract
    pub fn initialize_campaign(
        env: Env,
        admin: Address,
        token_wasm_hash: BytesN<32>,
        token: Address,
    ) {
        campaign::CampaignContract::initialize(env.clone(), admin);
        let share_contract = token::create_contract(&env, token_wasm_hash, &token);
        token::Client::new(&env, &share_contract).initialize(
            &env.current_contract_address(),
            &7u32,
            &"Pool Share Token".into_val(&env),
            &"POOL".into_val(&env),
        );
        campaign::CampaignContract::set_share_token(env.clone(), share_contract);
    }

    // Start a campaign
    pub fn start_campaign(env: Env, admin: Address) {
        campaign::CampaignContract::start(env.clone(), admin);
    }

    // Stop a campaign
    pub fn stop_campaign(env: Env, admin: Address) {
        campaign::CampaignContract::stop(env.clone(), admin);
    }

    // Get the status of the campaign
    pub fn check_campaign_status(env: Env) -> campaign::Status {
        campaign::CampaignContract::get_campaign_status(env.clone())
    }

    /// Helper function to add a new contributor to the storage.
    fn push_contributor(env: Env, contributor: Address) {
        let mut contributors = env
            .storage()
            .instance()
            .get(&campaign::DataKey::Contributors)
            .unwrap_or(vec![&env, contributor.clone()]);
        contributors.push_back(contributor);
        env.storage()
            .instance()
            .set(&campaign::DataKey::Contributors, &contributors);
    }

    // Check if a user is a contributor
    pub fn is_contributor(env: Env, contributor: Address) -> bool {
        campaign::CampaignContract::is_contributor(env.clone(), contributor)
    }

    // Add campaign interaction functions

    /// Records a deposit made by a contributor if the campaign is active.
    ///
    /// # Arguments
    ///
    /// - `env` - The execution environment of the contract.
    /// - `contributor` - The address of the contributor making the contribution.
    /// - `amount` - The amount of contribution in tokens.
    pub fn deposit(env: Env, contributor: Address, token: Address, amount: i128) {
        contributor.require_auth();
        // import Status enum from campaign module
        let status: campaign::Status = Self::check_campaign_status(env.clone());
        if status != campaign::Status::Active {
            panic!("contract is not active");
        }
        if !Self::is_contributor(env.clone(), contributor.clone()) {
            Self::push_contributor(env.clone(), contributor.clone());
        }
        // Transfer the tokens to the contract
        token::Client::new(&env, &token).transfer(
            &contributor,
            &env.current_contract_address(),
            &amount,
        );
        // Mint the share token to the contributor
        let share_token = campaign::CampaignContract::get_share_token(env.clone());
        token::Client::new(&env, &share_token).mint(&contributor, &amount);
        // Update the contribution in the storage
        Self::set_contribution(env.clone(), contributor.clone(), amount);
    }

    /// Withdraws the contribution made by a contributor if the campaign is active.
    ///
    /// # Arguments
    /// - `env` - The execution environment of the contract.
    /// - `contributor` - The address of the contributor making the contribution.
    /// - `amount` - The amount of contribution in tokens.
    /// - `token` - The address of the token to withdraw.
    /// - `recipient` - The address of the recipient of the contribution.
    pub fn withdraw(env: Env, contributor: Address, recipient: Address, token: Address) {
        contributor.require_auth();
        // import Status enum from campaign module
        let status: campaign::Status = Self::check_campaign_status(env.clone());
        if status != campaign::Status::Active {
            panic!("contract is not active");
        }
        if !Self::is_contributor(env.clone(), contributor.clone()) {
            panic!("contributor has not contributed");
        }
        let contribution = Self::get_contribution(env.clone(), contributor.clone());
        // Transfer the contribution to the recipient
        token::Client::new(&env, &token).transfer(
            &env.current_contract_address(),
            &recipient,
            &contribution,
        );
        // Burn the share token
        let share_token = campaign::CampaignContract::get_share_token(env.clone());
        token::Client::new(&env, &share_token).burn(&contributor, &contribution);

        // Clear the contributor from the storage
        campaign::CampaignContract::clear_contributor(env.clone(), contributor.clone());
    }

    // Get users total contribution
    pub fn get_contribution(env: Env, contributor: Address) -> i128 {
        campaign::CampaignContract::get_contribution(env.clone(), contributor)
    }

    pub fn set_contribution(env: Env, contributor: Address, amount: i128) {
        campaign::CampaignContract::set_contributor(env.clone(), contributor, amount);
    }

    // Get all contributors
    pub fn get_contributors(env: Env) -> Vec<Address> {
        let contributors: Vec<Address> = campaign::CampaignContract::get_contributors(env.clone());
        contributors
    }

    // Gets the total amount of campaign contributions
    pub fn get_total_contributions(env: Env) -> i128 {
        campaign::CampaignContract::get_total_contributions(env.clone())
    }

    // Get the ShareToken address
    pub fn get_share_token(env: Env) -> Address {
        campaign::CampaignContract::get_share_token(env.clone())
    }

    // Get user's share balance
    pub fn get_share_token_balance(env: Env, user: Address) -> i128 {
        let share_token = Self::get_share_token(env.clone());
        token::Client::new(&env, &share_token).balance(&user)
    }
}

// import Deposits and Balances module.
mod campaign;

// imports Token module
mod token;

// unit tests for the contract.
mod test;
