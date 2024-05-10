#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, Symbol};

// Define a contract type enum to represent different aspects of the contract
#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    IsActive,
    Balance,
    Name,
}

// Define the contract
#[contract]
pub struct MyContract;

#[contractimpl]
impl MyContract {
    // Function to deactivate the contract
    pub fn deactivate(env: &Env) {
        env.storage().persistent().set(&DataKey::IsActive, &false); // Set the IsActive state to false
    }

    // Function to activate the contract
    pub fn activate(env: &Env) {
        env.storage().persistent().set(&DataKey::IsActive, &true); // Set the IsActive state to true
    }

    // Function to update the balance
    pub fn update_balance(env: Env, new_balance: u128) {
        let is_active: bool = env
            .storage()
            .persistent()
            .get(&DataKey::IsActive)
            .unwrap_or(false); // Get the IsActive state from storage or default to false
        assert!(is_active, "Contract is not active"); // Ensure the contract is active
        env.storage()
            .persistent()
            .set(&DataKey::Balance, &new_balance); // Update the balance in storage
    }

    // Function to update the name
    pub fn update_name(env: Env, new_name: Symbol) {
        let is_active: bool = env
            .storage()
            .persistent()
            .get(&DataKey::IsActive)
            .unwrap_or(false); // Get the IsActive state from storage or default to false
        assert!(is_active, "Contract is not active"); // Ensure the contract is active
        env.storage().persistent().set(&DataKey::Name, &new_name); // Update the name in storage
    }

    // Function to get the balance
    pub fn get_balance(env: &Env) -> u128 {
        env.storage()
            .persistent()
            .get(&DataKey::Balance)
            .unwrap_or(0) // Get the balance from storage or default to 0
    }

    // Function to get the name
    pub fn get_name(env: &Env) -> Symbol {
        env.storage()
            .persistent()
            .get(&DataKey::Name)
            .unwrap_or(symbol_short!("Unknown")) // Get the name from storage or default to "Unknown"
    }

    // Function to check if the contract is active
    pub fn is_active(env: &Env) -> bool {
        env.storage()
            .persistent()
            .get(&DataKey::IsActive)
            .unwrap_or(false) // Get the IsActive state from storage or default to false
    }
}
