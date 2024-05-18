// The standard library is disabled to optimize the contract for low-resource environments like blockchain.
use soroban_sdk::{contract, contractimpl, contracttype, vec, Address, Env, Vec};

/// Enum representing different types of data keys used in contract storage.
/// This allows for structured access to data within the contract's storage system.
#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Contributions(Address),
    Contributors,
    Token,
    ShareToken,
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
pub struct CampaignContract;

// The `#[contractimpl]` exports the publicly accessible functions to the Soroban environment.
#[contractimpl]
impl CampaignContract {
    /// initialize the contract with the admin address
    ///
    /// # Arguments
    ///
    /// - `env` - The execution environment of the contract.
    /// - `admin` - The address of the admin.
    pub fn initialize(env: Env, admin: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Activates the campaign.
    ///
    /// # Arguments
    ///
    /// - `env` - The execution environment of the contract.
    pub fn start(env: Env, admin: Address) {
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
    pub fn stop(env: Env, admin: Address) {
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

    // Set the ShareToken address
    pub fn set_share_token(env: Env, share_token: Address) {
        env.storage()
            .instance()
            .set(&DataKey::ShareToken, &share_token);
    }

    // Get the ShareToken address
    pub fn get_share_token(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::ShareToken)
            .unwrap_or(env.current_contract_address())
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
            .get(&DataKey::Contributions(contributor))
            .unwrap_or(0)
            > 0
    }

    pub fn clear_contributor(env: Env, contributor: Address) {
        contributor.require_auth();
        env.storage()
            .instance()
            .remove(&DataKey::Contributions(contributor));
    }

    pub fn get_contribution(env: Env, contributor: Address) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::Contributions(contributor))
            .unwrap_or(0)
    }

    pub fn set_contributor(env: Env, contributor: Address, amount: i128) {
        env.storage()
            .instance()
            .set(&DataKey::Contributions(contributor), &amount)
    }

    pub fn get_contributors(env: Env) -> Vec<Address> {
        env.storage()
            .instance()
            .get(&DataKey::Contributors)
            .unwrap_or(vec![&env, env.current_contract_address()])
    }

    pub fn get_total_contributions(env: Env) -> i128 {
        let contributors = Self::get_contributors(env.clone());
        contributors
            .iter()
            .map(|contributor| Self::get_contribution(env.clone(), contributor.clone()))
            .sum()
    }
}
