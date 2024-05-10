#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, Symbol};

// Define a contract type for representing account data
#[contracttype]
pub struct Account {
    pub name: Symbol,  // Name of the account holder
    pub balance: u128, // Balance of the account
}

// Define a contract type enum for representing data keys
#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Account, // Represents the account data
}

// Define the main contract
#[contract]
pub struct MyContract;

#[contractimpl]
impl MyContract {
    // Function to create a new account
    pub fn new_account(env: &Env, new_name: Symbol, new_balance: u128) -> Account {
        // Store the new account data
        env.storage().persistent().set(
            &DataKey::Account,
            &Account {
                name: new_name.clone(),
                balance: new_balance,
            },
        );
        // Return the created account
        Account {
            name: new_name.clone(),
            balance: new_balance,
        }
    }

    // Function to retrieve the account data
    pub fn get_account(env: &Env) -> Account {
        // Get the account data from storage or return default values if not found
        env.storage()
            .persistent()
            .get(&DataKey::Account)
            .unwrap_or(Account {
                name: symbol_short!("none"),
                balance: 0,
            })
    }

    // Function to update the account balance
    pub fn update_balance(env: &Env, new_balance: u128) {
        // Get the current account data from storage
        let account = env
            .storage()
            .persistent()
            .get(&DataKey::Account)
            .unwrap_or(Account {
                name: symbol_short!("none"),
                balance: 0,
            });
        // Update the account balance in storage
        env.storage().persistent().set(
            &DataKey::Account,
            &Account {
                name: account.name,
                balance: new_balance,
            },
        );
    }

    // Function to update the account name
    pub fn update_name(env: &Env, new_name: Symbol) {
        // Get the current account data from storage
        let account = env
            .storage()
            .persistent()
            .get(&DataKey::Account)
            .unwrap_or(Account {
                name: symbol_short!("none"),
                balance: 0,
            });
        // Update the account name in storage
        env.storage().persistent().set(
            &DataKey::Account,
            &Account {
                name: new_name,
                balance: account.balance,
            },
        );
    }
}
