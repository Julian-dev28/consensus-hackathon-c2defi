#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

// #[derive(Clone)]
// #[contracttype]
// pub struct Mapping {
//     pub my_map: Map<Address, u128>,
// }

// #[derive(Clone)]
// #[contracttype]
// pub struct NestedMapping {
//     pub nested: Map<(Address, u128), bool>,
// OGMapExample,
// OGNestedMapExample,
// }

#[derive(Clone, PartialEq, Eq)]
#[contracttype]
pub enum DataKey {
    Map(Address),
    NestedMap(Address, u64),
}

#[contract]
pub struct MappingContract;

#[contractimpl]
impl MappingContract {
    pub fn get(env: &Env, addr: Address) -> u64 {
        env.storage()
            .persistent()
            .get(&DataKey::Map(addr))
            .unwrap_or(0)
    }

    pub fn set(env: &Env, addr: Address, value: u64) {
        env.storage().persistent().set(&DataKey::Map(addr), &value);
    }

    pub fn remove(env: &Env, addr: Address) {
        env.storage().persistent().remove(&DataKey::Map(addr));
    }

    pub fn get_nested_map(env: &Env, addr: Address, index: u64) -> bool {
        env.storage()
            .persistent()
            .get(&DataKey::NestedMap(addr, index))
            .unwrap_or(false)
    }

    pub fn set_nested_map(env: &Env, addr: Address, index: u64, value: bool) {
        env.storage()
            .persistent()
            .set(&DataKey::NestedMap(addr, index), &value);
    }

    pub fn remove_nested_map(env: &Env, addr: Address, index: u64) {
        env.storage()
            .persistent()
            .remove(&DataKey::NestedMap(addr, index));
    }
}
