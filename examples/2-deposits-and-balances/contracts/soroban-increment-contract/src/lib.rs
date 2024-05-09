#![no_std]
use soroban_sdk::{
    auth, contract, contractimpl, contracttype, log, symbol_short, vec, Address, Env, Symbol, Vec,
};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Contributor(Address),
    Contributors,
    Status,
}

// Define the enum to represent different states
#[derive(Clone, Copy, PartialEq, Eq)]
#[contracttype]
pub enum Status {
    Active = 0,
    Inactive = 1,
}

const COUNTER: Symbol = symbol_short!("COUNTER");

#[contract]
pub struct IncrementContract;

#[contractimpl]
impl IncrementContract {
    /// Increment increments an internal counter, and returns the value.
    pub fn increment(env: Env) -> u32 {
        // Get the current count.
        let mut count: u32 = env.storage().instance().get(&COUNTER).unwrap_or(0); // If no value set, assume 0.
        log!(&env, "count: {}", count);

        // Increment the count.
        count += 1;

        // Save the count.
        env.storage().instance().set(&COUNTER, &count);

        // The contract instance will be bumped to have a lifetime of at least 100 ledgers if the current expiration lifetime at most 50.
        // If the lifetime is already more than 100 ledgers, this is a no-op. Otherwise,
        // the lifetime is extended to 100 ledgers. This lifetime bump includes the contract
        // instance itself and all entries in storage().instance(), i.e, COUNTER.
        env.storage().instance().extend_ttl(50, 100);

        // Return the count to the caller.
        count
    }

    pub fn contribute(env: Env, contributor: Address, amount: u64) {
        contributor.require_auth();
        // Check if the campaign is active.
        if Self::get_campaign_status(env.clone()) != Status::Active {
            panic!("contract is not active");
        }

        if !Self::is_contributor(env.clone(), contributor.clone()) {
            Self::push_contributor(env.clone(), contributor.clone());
        }

        // Record the contribution.
        env.storage()
            .instance()
            .set(&DataKey::Contributor(contributor), &amount);
    }

    pub fn start_campaign(env: Env) {
        // Check if the contract is already active.
        if Self::get_campaign_status(env.clone()) == Status::Active {
            panic!("contract is already active");
        }

        // Set the contract status to active.
        Self::set_status(env.clone(), Status::Active);
    }

    pub fn stop_campaign(env: Env) {
        // Check if the contract is already inactive.
        if Self::get_campaign_status(env.clone()) == Status::Inactive {
            panic!("contract is already inactive");
        }

        // Set the contract status to inactive.
        Self::set_status(env.clone(), Status::Inactive);
    }

    pub fn get_count(env: Env) -> u32 {
        env.storage().instance().get(&COUNTER).unwrap_or(0)
    }

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
mod test;
