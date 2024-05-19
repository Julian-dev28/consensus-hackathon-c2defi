#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Env};

// Enum to represent different data keys
#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Status,
}

// Define the enum to represent different states
#[derive(Clone, Copy, PartialEq, Eq)]
#[contracttype]
pub enum Status {
    Pending = 0,
    Shipped = 1,
    Accepted = 2,
    Rejected = 3,
    Canceled = 4,
}

#[contract]
pub struct StateContract;

#[contractimpl]
impl StateContract {
    // Initialize the contract with the initial state
    pub fn initialize(env: &Env) {
        env.storage()
            .persistent()
            .set(&DataKey::Status, &Status::Pending);
    }

    // Function to get the current state of the contract
    pub fn get_state(env: &Env) -> Status {
        env.storage()
            .persistent()
            .get(&DataKey::Status)
            .unwrap_or(Status::Pending)
    }

    // Function to set the state of the contract
    pub fn set_state(env: &Env, new_state: Status) {
        env.storage().persistent().set(&DataKey::Status, &new_state);
    }
    // }

    //     Function to set the state of the contract to shipped
    pub fn ship(env: &Env) {
        env.storage()
            .persistent()
            .set(&DataKey::Status, &Status::Shipped);
    }
}
