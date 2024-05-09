<head>
Install and configure Rust to deploy smart contracts.
  <meta charSet="utf-8" />
  <meta
    property="og:title"
    content="Install and configure Rust to deploy smart contracts."
  />
  <meta
    property="og:description"
    content="Get setup to write, deploy, and invoke your first Rust smart contract by installing Rust, installing a target, configuring an editor, and installing a CLI."
  />
</head>

Soroban contracts are small programs written in the [Rust] programming language.

To build and develop contracts you need only a couple prerequisites:

- A [Rust] toolchain
- An editor that supports Rust
- [Soroban CLI]

## Install Rust

### Linux, macOS, or other Unix-like OS

If you use macOS, Linux, or another Unix-like OS, the simplest method to install a Rust toolchain is to install `rustup`. Install `rustup` with the following command.

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Windows

On Windows, download and run [rustup-init.exe](https://static.rust-lang.org/rustup/dist/i686-pc-windows-gnu/rustup-init.exe). You can continue with the default settings by pressing Enter.

The soroban CLI uses emojis in its output. To properly render them on Windows, it is recommended to use the [Windows Terminal](https://learn.microsoft.com/en-us/windows/terminal/). See [how to install Windows Terminal](https://learn.microsoft.com/en-us/windows/terminal/install) on Microsoft Learn. If the CLI is used in the built in Windows Command Prompt or Windows PowerShell the CLI will function as expected but the emojis will appear as question marks.

If you're already using [WSL](https://learn.microsoft.com/en-us/windows/wsl/install), you can also follow the instructions for Linux.

### Other

For other methods of installing [Rust], see: https://www.rust-lang.org/tools/install

## Install the target

Install the `wasm32-unknown-unknown` target.

```sh
rustup target add wasm32-unknown-unknown
```

## Configure an Editor

Many editors have support for Rust. Visit the following link to find out how to configure your editor: https://www.rust-lang.org/tools

A popular editor is Visual Studio Code:

- [Visual Studio Code] editor.
- [Rust Analyzer] for Rust language support.
- [CodeLLDB] for step-through-debugging.

[visual studio code]: https://code.visualstudio.com
[rust analyzer]: https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer
[codelldb]: https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb

## Install the Soroban CLI

The [Soroban CLI](http://github.com/stellar/soroban-cli) can execute Soroban contracts in the same environment the contract will execute on network, however in a local sandbox.

Install the [latest released version](https://github.com/stellar/soroban-cli/releases) of Soroban CLI using `cargo install`.

```sh
cargo install --locked soroban-cli
```

Report issues and share feedback about the Soroban CLI [here](https://github.com/stellar/soroban-cli/issues/new/choose).

### Usage

Run the `soroban` command and you should see output like below.

```sh
soroban
```

```console
$ soroban
Build, deploy, & interact with contracts; set identities to sign with; configure networks; generate keys; and more.

Intro: https://soroban.stellar.org
CLI Reference: https://github.com/stellar/soroban-tools/tree/main/docs/soroban-cli-full-docs.md

Usage: soroban [OPTIONS] <COMMAND>

Commands:
  completion  Print shell completion code for the specified shell
  config      Deprecated, use `soroban keys` and `soroban network` instead
  contract    Tools for smart contract developers
  events      Watch the network for contract events
  keys        Create and manage identities including keys and addresses
  lab         Experiment with early features and expert tools
  network     Start and configure networks
  version     Print version information

Options:
      --global                     Use global config
  -f, --filter-logs <FILTER_LOGS>  Filter logs output. To turn on "soroban_cli::log::footprint=debug" or off "=off". Can also use env var `RUST_LOG`
  -q, --quiet                      Do not write logs to stderr including `INFO`
  -v, --verbose                    Log DEBUG events
      --very-verbose               Log DEBUG and TRACE events [aliases: vv]
      --list                       List installed plugins. E.g. `soroban-hello`
  -h, --help                       Print help (see more with '--help')
  -V, --version                    Print version

TESTING_OPTIONS:
      --config-dir <CONFIG_DIR>  Location of config directory, default is "."
```

You can use `soroban completion` to generate shell completion for `bash`, `elvish`, `fish`, `powershell`, and `zsh`. You should absolutely try it out. It will feel like a super power!

To enable autocomplete in the current bash shell, run:

```sh
source <(soroban completion --shell bash)
```

To enable autocomplete permanently in future bash shells, run:

```sh
echo "source <(soroban completion --shell bash)" >> ~/.bashrc
```

Users of non-bash shells may need to adapt the above commands to suit their needs.

### Configuring the CLI for Testnet

Soroban has a test network called Testnet that you can use to deploy and test your smart contracts. It's a live network, but it's not the same as the Stellar public network. It's a separate network that is used for development and testing, so you can't use it for production apps. But it's a great place to test your contracts before you deploy them to the public network.

To configure your CLI to interact with Testnet, run the following command:

<Tabs groupId="platform" defaultValue={getPlatform()}>

<TabItem value="unix" label="macOS/Linux">

```sh
soroban network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

</TabItem>

<TabItem value="windows" label="Windows (PowerShell)">

```powershell
soroban network add `
  --global testnet `
  --rpc-url https://soroban-testnet.stellar.org:443 `
  --network-passphrase "Test SDF Network ; September 2015"
```

</TabItem>

</Tabs>

Note the `--global` flag. This creates a file in your home folder's `~/.config/soroban/network/testnet.toml` with the settings you specified. This means that you can use the `--network testnet` flag in any Soroban CLI command to use this network from any directory or filepath on your system.

If you want project-specific network configurations, you can omit the `--global` flag, and the networks will be added to your working directory's `.soroban/network` folder instead.

### Configure an Identity

When you deploy a smart contract to a network, you need to specify an identity that will be used to sign the transactions.

Let's configure an identity called `alice`. You can use any name you want, but it might be nice to have some named identities that you can use for testing, such as [`alice`, `bob`, and `carol`](https://en.wikipedia.org/wiki/Alice_and_Bob).

```sh
soroban keys generate --global alice --network testnet
```

You can see the public key of `alice` with:

```sh
soroban keys address alice
```

Like the Network configs, the `--global` means that the identity gets stored in `~/.config/soroban/identity/alice.toml`. You can omit the `--global` flag to store the identity in your project's `.soroban/identity` folder instead.

By default, `soroban keys generate` will fund the account using [Friendbot](https://developers.stellar.org/docs/fundamentals-and-concepts/testnet-and-pubnet#friendbot). To disable this behavior, append `--no-fund` to the command when running it.

[rust]: https://www.rust-lang.org/
[soroban cli]: setup.mdx#install-the-soroban-cli

---

sidebar_position: 10
title: 1. Hello World
description: Create your first smart contract in Rust.

---

<head>
  <meta charSet="utf-8" />
  <meta
    property="og:title"
    content="Create your first smart contract in Rust."
  />
  <meta
    property="og:description"
    content="Write a simple smart contract in Rust that can be deployed to a Soroban network."
  />
</head>

Once you've [set up](./setup.mdx) your development environment, you're ready to create your first Soroban contract.

## Create a New Project

Create a new project using the `init` command to create a `getting-started-tutorial` project.

```sh
soroban contract init soroban-hello-world
```

The `init` command will create a Rust workspace project, using the recommended structure for including Soroban contracts. Let’s take a look at the project structure:

```
.
├── Cargo.lock
├── Cargo.toml
├── README.md
└── contracts
    └── hello_world
        ├── Cargo.toml
        └── src
            ├── lib.rs
            └── test.rs
```

### Cargo.toml

The `Cargo.toml` file at the root of the project is set up as Rust Workspace, which allows us to include multiple Soroban contracts in one project.

#### Rust Workspace

The `Cargo.toml` file sets the workspace’s members as all contents of the `contracts` directory and sets the workspace’s `soroban-sdk` dependency version including the `testutils` feature, which will allow test utilities to be generated for calling the contract in tests.

```toml title="Cargo.toml"
[workspace]
resolver = "2"
members = [
  "contracts/*",
]

[workspace.dependencies]
soroban-sdk = "20.3.2"
```

The `testutils` are automatically enabled inside [Rust unit tests] inside the same crate as your contract. If you write tests from another crate, you'll need to require the `testutils` feature for those tests and enable the `testutils` feature when running your tests with `cargo test --features testutils` to be able to use those test utilities.

#### `release` Profile

Configuring the `release` profile to optimize the contract build is critical. Soroban contracts have a maximum size of 64KB. Rust programs, even small ones, without these configurations almost always exceed this size.

The `Cargo.toml` file has the following release profile configured.

```toml
[profile.release]
opt-level = "z"
overflow-checks = true
debug = 0
strip = "symbols"
debug-assertions = false
panic = "abort"
codegen-units = 1
lto = true
```

#### `release-with-logs` Profile

Configuring a `release-with-logs` profile can be useful if you need to build a `.wasm` file that has logs enabled for printing debug logs when using the [`soroban-cli`]. Note that this is not necessary to access debug logs in tests or to use a step-through-debugger.

```toml
[profile.release-with-logs]
inherits = "release"
debug-assertions = true
```

See the [logging example] for more information about how to log.

[logging example]: ../example-contracts/logging.mdx

### Contracts Directory

The `contracts` directory is where Soroban contracts will live, each in their own directory. There is already a `hello_world` contract in there to get you started.

#### Contract-specific Cargo.toml file

Each contract should have its own `Cargo.toml` file, which relies on the top-level `Cargo.toml` that we just discussed.

This is where we can specify contract-specific package information.

```toml title="contracts/hello_world/Cargo.toml"
[package]
name = "hello-world"
version = "0.0.0"
edition = "2021"
publish = false
```

The `crate-type` is configured to `cdylib` which is required for building contracts.

```toml
[lib]
crate-type = ["cdylib"]
doctest = false
```

We also have included the soroban-sdk dependency, configured to use the version from the workspace Cargo.toml.

```toml
[dependencies]
soroban-sdk = { workspace = true }

[dev-dependencies]
soroban-sdk = { workspace = true, features = ["testutils"] }
```

#### Contract Source Code

Creating a Soroban contract involves writing Rust code in the project’s `lib.rs` file.

All contracts should begin with `#![no_std]` to ensure that the Rust standard library is not included in the build. The Rust standard library is large and not well suited to being deployed into small programs like those deployed to blockchains.

```rust
#![no_std]
```

The contract imports the types and macros that it needs from the `soroban-sdk` crate.

```rust
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec};
```

Many of the types available in typical Rust programs, such as `std::vec::Vec`, are not available, as there is no allocator and no heap memory in Soroban contracts. The `soroban-sdk` provides a variety of types like `Vec`, `Map`, `Bytes`, `BytesN`, `Symbol`, that all utilize the Soroban environment's memory and native capabilities. Primitive values like `u128`, `i128`, `u64`, `i64`, `u32`, `i32`, and `bool` can also be used. Floats and floating point math are not supported.

Contract inputs must not be references.

The `#[contract]` attribute designates the Contract struct as the type to which contract functions are associated. This implies that the struct will have contract functions implemented for it.

```rust
#[contract]
pub struct HelloContract;
```

Contract functions are defined within an `impl` block for the struct, which is annotated with `#[contractimpl]`. It is important to note that contract functions should have names with a maximum length of 32 characters. Additionally, if a function is intended to be invoked from outside the contract, it should be marked with the `pub` visibility modifier. It is common for the first argument of a contract function to be of type `Env`, allowing access to a copy of the Soroban environment, which is typically necessary for various operations within the contract.

```rust
#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        vec![&env, symbol_short!("Hello"), to]
    }
}
```

Putting those pieces together a simple contract looks like this.

```rust title="contracts/hello_world/src/lib.rs"
#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec};

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        vec![&env, symbol_short!("Hello"), to]
    }
}

mod test;
```

Note the `mod test` line at the bottom, this will tell Rust to compile and run the test code, which we’ll take a look at next.

#### Contract Unit Tests

Writing tests for Soroban contracts involves writing Rust code using the test facilities and toolchain that you'd use for testing any Rust code.

Given our HelloContract, a simple test will look like this.

<Tabs>
<TabItem value="lib.rs" label="contracts/hello_world/src/lib.rs">

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec};

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        vec![&env, symbol_short!("Hello"), to]
    }
}

mod test;
```

</TabItem>
<TabItem value="test.rs" label="contracts/hello_world/src/test.rs" default>

```rust
#![cfg(test)]

use super::*;
use soroban_sdk::{symbol_short, vec, Env};

#[test]
fn test() {
    let env = Env::default();
    let contract_id = env.register_contract(None, HelloContract);
    let client = HelloContractClient::new(&env, &contract_id);

    let words = client.hello(&symbol_short!("Dev"));
    assert_eq!(
        words,
        vec![&env, symbol_short!("Hello"), symbol_short!("Dev"),]
    );
}
```

</TabItem>
</Tabs>

In any test the first thing that is always required is an `Env`, which is the Soroban environment that the contract will run inside of.

```rust
let env = Env::default();
```

The contract is registered with the environment using the contract type. Contracts can specify a fixed contract ID as the first argument, or provide `None` and one will be generated.

```rust
let contract_id = env.register_contract(None, Contract);
```

All public functions within an `impl` block that is annotated with the `#[contractimpl]` attribute have a corresponding function generated in a generated client type. The client type will be named the same as the contract type with `Client` appended. For example, in our contract the contract type is `Contract`, and the client is named `ContractClient`.

```rust
let client = ContractClient::new(&env, &contract_id);
let words = client.hello(&symbol_short!("Dev"));
```

The values returned by functions can be asserted on:

```rust
assert_eq!(
    words,
    vec![&env, symbol_short!("Hello"), symbol_short!("Dev"),]
);
```

## Run the Tests

Run `cargo test` and watch the unit test run. You should see the following output:

```sh
cargo test
```

```
running 1 test
test test::test ... ok
```

Try changing the values in the test to see how it works.

**_NOTE:_**The first time you run the tests you may see output in the terminal of cargo compiling all the dependencies before running the tests.

## Build the contract

To build a Soroban contract to deploy or run, use the `soroban contract build` command.

```sh
soroban contract build
```

This is a small wrapper around `cargo build` that sets the target to `wasm32-unknown-unknown` and the profile to `release`. You can think of it as a shortcut for the following command:

```sh
cargo build --target wasm32-unknown-unknown --release
```

A `.wasm` file will be outputted in the `target` directory, at `target/wasm32-unknown-unknown/release/hello_world.wasm`. The `.wasm` file is the built contract.

The `.wasm` file contains the logic of the contract, as well as the contract's [specification / interface types](../../learn/smart-contract-internals/types/fully-typed-contracts.mdx), which can be imported into other contracts who wish to call it. This is the only artifact needed to deploy the contract, share the interface with others, or integration test against the contract.

## Optimizing Builds

Use `soroban contract optimize` to further minimize the size of the `.wasm`. First, re-install soroban-cli with the `opt` feature:

```sh
cargo install --locked soroban-cli --features opt
```

Then build an optimized `.wasm` file:

```sh
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/hello_world.wasm
```

This will optimize and output a new `hello_world.optimized.wasm` file in the same location as the input `.wasm`.

Building optimized contracts is only necessary when deploying to a network with fees or when analyzing and profiling a contract to get it as small as possible. If you're just starting out writing a contract, these steps are not necessary. See [Build](#build) for details on how to build for development.

## Summary

In this section, we wrote a simple contract that can be deployed to a Soroban network.

Next we'll learn to deploy the HelloWorld contract to Stellar's Testnet network and interact with it over RPC using the CLI.

[rust unit tests]: https://doc.rust-lang.org/rust-by-example/testing/unit_testing.html
[`soroban-cli`]: setup.mdx#install-the-soroban-cli

deploy-to-testnet.mdx
create-an-app.mdx
deploy-increment-contract.mdx

all in other repos for streamlined deployment
