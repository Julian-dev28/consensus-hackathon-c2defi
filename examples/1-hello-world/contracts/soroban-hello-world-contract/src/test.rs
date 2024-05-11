// This configuration line ensures the code below is only compiled and run during testing.
#![cfg(test)]

// Import the entire parent module to access `HelloContract` and other necessary elements.
use super::*;
// Import specific utilities from the Soroban SDK needed for the tests.
use soroban_sdk::{symbol_short, vec, Env};

// Define a test case named `test_hello`.
#[test]
fn test_hello() {
    // Create a default environment which will simulate blockchain conditions for testing.
    let env = Env::default();
    // Register `HelloContract` within this environment, simulating the deployment of the contract.
    let contract_id = env.register_contract(None, HelloContract);
    // Instantiate a client for `HelloContract` using the contract ID, enabling interaction with the contract.
    let client = HelloContractClient::new(&env, &contract_id);

    // Call the `hello` method of the contract using the client, passing "Dev" as the argument.
    let words = client.hello(&symbol_short!("Dev"));
    // Verify that the `hello` method returns the expected vector of symbols: "Hello" followed by "Dev".
    // This assertion ensures that the contract behaves as expected.
    assert_eq!(
        words,
        vec![&env, symbol_short!("Hello"), symbol_short!("Dev"),]
    );
}
