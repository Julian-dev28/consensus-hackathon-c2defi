// The standard library is disabled to optimize the contract for low-resource environments like blockchain.
#![no_std]

// Importing essential modules and macros from the Soroban SDK for contract development.
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec};

// Symbols are similar to strings but are optimized for low-resource environments like blockchain.
// Vec(Vector) is a collection type that can store multiple elements of the same type and is comparable to an Array in other languages.

// The `#[contract]` attribute marks a type as being the type that contract functions are attached for.
#[contract]
pub struct HelloContract;

// The `#[contractimpl]` exports the publicly accessible functions to the Soroban environment.
#[contractimpl]
impl HelloContract {
    /// Generates a greeting message in the form of a symbol vector.
    ///
    /// # Arguments
    ///
    /// - `env` - The execution environment of the contract, providing context and utilities.
    /// - `to` - The symbol representing the entity being greeted.
    ///
    /// # Returns
    ///
    /// - A vector of symbols containing the greeting and the target of the greeting.
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        // Constructs and returns a vector containing the greeting "Hello" followed by the to value.
        // The `vec!` and `symbol_short!` macros are used to create the vector and symbol respectively.
        vec![&env, symbol_short!("Hello"), to]
    }
}

// Unit tests for the contract implementation.
mod test;
