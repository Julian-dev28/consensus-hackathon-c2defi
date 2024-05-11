// The standard library is disabled to optimize the contract for low-resource environments like blockchain.
use soroban_sdk::{contract, contractimpl, contracttype, vec, Address, Env, Vec};

/// Enum representing different types of data keys used in contract storage.
/// This allows for structured access to data within the contract's storage system.
#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Contributor(Address),
    Contributors,
    Status,
    Admin,
}

// Define the enum to represent different states
#[derive(Clone, Copy, PartialEq, Eq)]
#[contracttype]
pub enum Status {
    Active = 0,
    Inactive = 1,
}

// The `#[contract]` attribute marks a type as being the type that contract functions are attached for.
#[contract]
pub struct DepositandBalanceContract;

// The `#[contractimpl]` exports the publicly accessible functions to the Soroban environment.
#[contractimpl]
impl DepositandBalanceContract {
    /// initialize the contract with the admin address
    ///
    /// # Arguments
    ///
    /// - `env` - The execution environment of the contract.
    /// - `admin` - The address of the admin.
    pub fn initialize(env: Env, admin: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Records a contribution made by a contributor if the campaign is active.
    ///
    /// # Arguments
    ///
    /// - `env` - The execution environment of the contract.
    /// - `contributor` - The address of the contributor making the contribution.
    /// - `amount` - The amount of contribution in tokens.
    pub fn contribute(env: Env, contributor: Address, amount: u64) {
        contributor.require_auth();
        if Self::get_campaign_status(env.clone()) != Status::Active {
            panic!("contract is not active");
        }
        if !Self::is_contributor(env.clone(), contributor.clone()) {
            Self::push_contributor(env.clone(), contributor.clone());
        }
        env.storage()
            .instance()
            .set(&DataKey::Contributor(contributor), &amount);
    }

    /// Activates the campaign.
    ///
    /// # Arguments
    ///
    /// - `env` - The execution environment of the contract.
    pub fn start_campaign(env: Env, admin: Address) {
        admin.require_auth();
        assert_eq!(
            admin,
            env.storage()
                .instance()
                .get(&DataKey::Admin)
                .unwrap_or(env.current_contract_address())
        );
        if Self::get_campaign_status(env.clone()) == Status::Active {
            panic!("contract is already active");
        }
        Self::set_status(env.clone(), Status::Active);
    }

    /// Deactivates the campaign.
    ///
    /// # Arguments
    ///
    /// - `env` - The execution environment of the contract.
    pub fn stop_campaign(env: Env, admin: Address) {
        admin.require_auth();
        assert_eq!(
            admin,
            env.storage()
                .instance()
                .get(&DataKey::Admin)
                .unwrap_or(env.current_contract_address())
        );
        if Self::get_campaign_status(env.clone()) == Status::Inactive {
            panic!("contract is already inactive");
        }
        Self::set_status(env.clone(), Status::Inactive);
    }

    // Utility functions to get and set data in storage.
    pub fn set_status(env: Env, status: Status) {
        env.storage().instance().set(&DataKey::Status, &status);
    }

    pub fn get_campaign_status(env: Env) -> Status {
        env.storage()
            .instance()
            .get(&DataKey::Status)
            .unwrap_or(Status::Inactive)
    }

    pub fn is_contributor(env: Env, contributor: Address) -> bool {
        env.storage()
            .instance()
            .get(&DataKey::Contributor(contributor))
            .unwrap_or(0)
            > 0
    }

    pub fn clear_contributor(env: Env, contributor: Address) {
        contributor.require_auth();
        env.storage()
            .instance()
            .remove(&DataKey::Contributor(contributor));
    }

    pub fn get_contribution(env: Env, contributor: Address) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::Contributor(contributor))
            .unwrap_or(0)
    }

    pub fn get_contributors(env: Env) -> Vec<Address> {
        env.storage()
            .instance()
            .get(&DataKey::Contributors)
            .unwrap_or(vec![&env, env.current_contract_address()])
    }

    pub fn get_total_contributions(env: Env) -> u64 {
        let contributors = Self::get_contributors(env.clone());
        contributors
            .iter()
            .map(|contributor| Self::get_contribution(env.clone(), contributor.clone()))
            .sum()
    }

    /// Helper function to add a new contributor to the storage.
    fn push_contributor(env: Env, contributor: Address) {
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
}
