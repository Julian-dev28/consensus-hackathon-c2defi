// CFG is used to tell the compiler to only compile the module when running tests.
#![cfg(test)]

// Import the contract and client
// super is used to access the parent module.
use super::{IncrementContract, IncrementContractClient};

// Import the test utilities.
// The testutils module is used to create a mock environment for testing.
use soroban_sdk::{
    testutils::{Address, Logs},
    Env,
};

extern crate std;

#[test]
fn increment() {
    // Create a new environment.
    // The environment is used to simulate the blockchain and the contract execution.
    let env = Env::default();

    // Register the contract.
    let contract_id = env.register_contract(None, IncrementContract);
    // Create a client for the contract.
    let client = IncrementContractClient::new(&env, &contract_id);

    // Increment the counter and check that the COUNTER value is updated.
    assert_eq!(client.increment(), 1);
    assert_eq!(client.increment(), 2);
    assert_eq!(client.increment(), 3);

    // Print the logs.
    std::println!("{}", env.logs().all().join("\n"));
}
#[test]
fn contribute() {
    // Create a new environment.
    // The environment is used to simulate the blockchain and the contract execution.
    let env = Env::default();

    // Mock all authorizations.
    // This is used to mock the authorization of signers for executing transactions.
    env.mock_all_auths();

    // Register the contract.
    let contract_id = env.register_contract(None, IncrementContract);
    // Create a client for the contract.
    let client = IncrementContractClient::new(&env, &contract_id);
    // Create a new address for the admin.
    let admin = <soroban_sdk::Address as Address>::generate(&env);
    // Create a new address for the contributor.
    let contributor = <soroban_sdk::Address as Address>::generate(&env);

    // Initialize the contract with the admin.
    client.initialize(&admin);
    // Start a campaign with the admin.
    client.start_campaign(&admin.clone());
    // Contribute to the campaign with the contributor.
    client.contribute(&contributor, &100);
    // Check the contribution of the contributor.
    assert_eq!(client.get_contribution(&contributor), 100);
}
