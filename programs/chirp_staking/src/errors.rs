//! Program errors
use anchor_lang::prelude::*;
// All Error codes
#[error_code]
pub enum StakingErrors {
    #[msg("Check input values")]
    InvalidInputValues,
    #[msg("Invalid pool id")]
    InvalidPoolId,
    #[msg("Invalid token account")]
    InvalidTokenAccount,
    #[msg("No tokens")]
    NoTokens,
    #[msg("Error transfering tokens")]
    TransferError,
    #[msg("Already initialized")]
    AlreadyInitialized,
    #[msg("Nothing to Claim")]
    NothingToClaim,
    #[msg("Error while trying to mint tokens")]
    MintError,
    #[msg("Is not owner")]
    NotOwner,
    #[msg("Inactive pool")]
    InactivePool,
}
