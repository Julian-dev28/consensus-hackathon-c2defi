#![no_std]

use soroban_sdk::{contract, contractimpl, Env, Symbol};

#[contract]
pub struct HelloWorldContract;

#[contractimpl]
impl HelloWorldContract {
    pub fn greet(env: &Env) -> Symbol {
        Symbol::new(env, "Hello, World!")
    }
}
