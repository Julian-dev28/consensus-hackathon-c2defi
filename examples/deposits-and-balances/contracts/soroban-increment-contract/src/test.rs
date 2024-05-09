#![cfg(test)]

use super::{IncrementContract, IncrementContractClient};
use soroban_sdk::{
    testutils::{Address, Logs},
    Env,
};

extern crate std;

#[test]
fn test() {
    let env = Env::default();
    let contract_id = env.register_contract(None, IncrementContract);
    let client = IncrementContractClient::new(&env, &contract_id);

    assert_eq!(client.increment(), 1);
    assert_eq!(client.increment(), 2);
    assert_eq!(client.increment(), 3);

    std::println!("{}", env.logs().all().join("\n"));
}
#[test]
fn test_contribute() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, IncrementContract);
    let client = IncrementContractClient::new(&env, &contract_id);
    let contributor = <soroban_sdk::Address as Address>::generate(&env);
    client.start_campaign();
    client.contribute(&contributor, &100);
    assert_eq!(client.get_contribution(&contributor), 100);
}
