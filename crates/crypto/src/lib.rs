#![forbid(unsafe_code)]
#![warn(clippy::pedantic)]
#![warn(clippy::correctness)]
#![warn(clippy::perf)]
#![warn(clippy::style)]
#![warn(clippy::suspicious)]
#![warn(clippy::nursery)]
#![warn(clippy::correctness)]
#![allow(clippy::missing_panics_doc)]
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::module_name_repetitions)]
#![allow(clippy::similar_names)]
#![allow(clippy::option_if_let_else)]

pub mod crypto;
pub mod error;
pub mod header;
pub mod keys;
pub mod primitives;
pub mod protected;

// Re-export this so that payloads can be generated elsewhere
pub use aead::Payload;

// Make this easier to use (e.g. `sd_crypto::Protected`)
pub use protected::Protected;

// Re-export zeroize so it can be used elsewhere
pub use zeroize::Zeroize;

pub use self::error::{Error, Result};
