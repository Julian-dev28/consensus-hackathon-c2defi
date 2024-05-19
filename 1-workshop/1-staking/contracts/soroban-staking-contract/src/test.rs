// CFG is used to tell the compiler to only compile the module when running tests.
#![cfg(test)]
extern crate std;

// Import the contract and client
// super is used to access the parent module.
use super::{token, StakingContract, StakingContractClient};

// Import the test utilities.
// The testutils module is used to create a mock environment for testing.
use soroban_sdk::{testutils::Address as _, Address, BytesN, Env};

fn create_token_contract<'a>(e: &Env, admin: &Address) -> token::Client<'a> {
    token::Client::new(e, &e.register_stellar_asset_contract(admin.clone()))
}

fn install_token_wasm(env: &Env) -> BytesN<32> {
    soroban_sdk::contractimport!(file = "./token/soroban_token_contract.wasm");
    env.deployer().upload_contract_wasm(WASM)
}

#[test]
fn contribute() {
    // Create a new environment.
    // The environment is used to simulate the blockchain and the contract execution.
    let env = Env::default();

    // Mock all authorizations.
    // This is used to mock the authorization of signers for executing transactions.
    env.mock_all_auths();

    // Create a new address for the admin.
    let admin = Address::generate(&env);
    // Create a new address for the user.
    let user = Address::generate(&env);

    // Create a token.
    let token1 = create_token_contract(&env, &admin);

    // Register the contract.
    let contract_id = env.register_contract(None, StakingContract);

    // Create a client for the contract.
    let client = StakingContractClient::new(&env, &contract_id);

    // Mint tokens for the user.
    token1.mint(&user, &1000);
    assert_eq!(token1.balance(&user), 1000);
    // Initialize the contract with the admin.
    client.initialize(&admin, &install_token_wasm(&env), &token1.address);
    // Start a campaign with the admin.
    client.start_campaign(&admin.clone());
    // Contribute to the campaign with the contributor.
    client.deposit(&user, &token1.address, &100);
    // Check the contribution of the contributor.
    assert_eq!(client.get_user_contribution(&user), 100);
    // Check the share token balance of the contributor.
    assert_eq!(client.get_share_token_balance(&user), 100);
}
