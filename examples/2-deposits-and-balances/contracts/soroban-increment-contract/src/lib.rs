// The standard library is disabled to optimize the contract for low-resource environments like blockchain.
#![no_std]
use soroban_sdk::{contract, contractimpl, log, symbol_short, Address, Env, Symbol};

// unit tests for the contract.
mod dnb;
mod test;

/// Symbol used as a key for accessing the counter in the contract's storage.
/// This counter is used to track a specific value, such as the number of actions performed.
const COUNTER: Symbol = symbol_short!("COUNTER");

// The `#[contract]` attribute marks a type as being the type that contract functions are attached for.
#[contract]
pub struct IncrementContract;

// The `#[contractimpl]` exports the publicly accessible functions to the Soroban environment.

#[contractimpl]
impl IncrementContract {
    /// Increments an internal counter and returns the new count.
    ///
    /// # Arguments
    ///
    /// - `env` - The execution environment of the contract, providing access to blockchain storage and utilities.
    ///
    /// # Returns
    ///
    /// - The new value of the counter after incrementation.
    pub fn increment(env: Env) -> u32 {
        let mut count: u32 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        log!(&env, "count: {}", count);
        count += 1;
        env.storage().instance().set(&COUNTER, &count);
        env.storage().instance().extend_ttl(50, 100);
        count
    }

    // Utility functions to get and set data in storage.
    pub fn get_count(env: Env) -> u32 {
        env.storage().instance().get(&COUNTER).unwrap_or(0)
    }

    // Add the deposit and balances contract functions to the increment contract

    // Initialize the contract
    pub fn initialize(env: Env, admin: Address) {
        dnb::DepositandBalanceContract::initialize(env.clone(), admin);
    }

    // Start a campaign
    pub fn start_campaign(env: Env, admin: Address) {
        dnb::DepositandBalanceContract::start_campaign(env.clone(), admin);
    }

    // Get the status of the campaign
    pub fn get_campaign_status(env: Env) -> dnb::Status {
        dnb::DepositandBalanceContract::get_campaign_status(env.clone())
    }

    // Contribute to the campaign
    pub fn contribute(env: Env, contributor: Address, amount: u64) {
        dnb::DepositandBalanceContract::contribute(env.clone(), contributor, amount);
    }

    // Get the contribution of a contributor
    pub fn get_contribution(env: Env, contributor: Address) -> u64 {
        dnb::DepositandBalanceContract::get_contribution(env.clone(), contributor)
    }

    // Get the total contributions
    pub fn get_total_contributions(env: Env) -> u64 {
        dnb::DepositandBalanceContract::get_total_contributions(env.clone())
    }

    // Stop the campaign
    pub fn stop_campaign(env: Env, admin: Address) {
        dnb::DepositandBalanceContract::stop_campaign(env.clone(), admin);
    }

    // Clear a contributor
    pub fn clear_contributor(env: Env, contributor: Address) {
        dnb::DepositandBalanceContract::clear_contributor(env.clone(), contributor);
    }
}
