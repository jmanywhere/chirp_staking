export type ChirpStaking = {
  "version": "0.1.0",
  "name": "chirp_staking",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createPool",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "newPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "u8"
        },
        {
          "name": "lockDuration",
          "type": "i64"
        },
        {
          "name": "rewardBasis",
          "type": "u32"
        }
      ]
    },
    {
      "name": "stake",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "positionVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "positionVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "enableDisablePool",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "u8"
        },
        {
          "name": "activeStatus",
          "type": "bool"
        }
      ]
    },
    {
      "name": "updatePoolLock",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "u8"
        },
        {
          "name": "lockDuration",
          "type": "i64"
        }
      ]
    },
    {
      "name": "updatePoolReward",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "u8"
        },
        {
          "name": "rewardBasis",
          "type": "u32"
        }
      ]
    },
    {
      "name": "allPoolActiveStatus",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "status",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalStaked",
            "type": "u64"
          },
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "totalPools",
            "type": "u8"
          },
          {
            "name": "poolsEnabled",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "u8"
          },
          {
            "name": "poolStaked",
            "type": "u64"
          },
          {
            "name": "lockDuration",
            "type": "i64"
          },
          {
            "name": "rewardBasis",
            "type": "u32"
          },
          {
            "name": "isActive",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "stakingPosition",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakedAmount",
            "type": "u64"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "lockAmount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "CreatePoolEvent",
      "fields": [
        {
          "name": "poolId",
          "type": "u8",
          "index": false
        },
        {
          "name": "lockDuration",
          "type": "i64",
          "index": false
        },
        {
          "name": "rewardBasis",
          "type": "u32",
          "index": false
        }
      ]
    },
    {
      "name": "UserStakedEvent",
      "fields": [
        {
          "name": "poolId",
          "type": "u8",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UserUnstakedEvent",
      "fields": [
        {
          "name": "poolId",
          "type": "u8",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardAmount",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidInputValues",
      "msg": "Check input values"
    },
    {
      "code": 6001,
      "name": "InvalidPoolId",
      "msg": "Invalid pool id"
    },
    {
      "code": 6002,
      "name": "InvalidTokenAccount",
      "msg": "Invalid token account"
    },
    {
      "code": 6003,
      "name": "NoTokens",
      "msg": "No tokens"
    },
    {
      "code": 6004,
      "name": "TransferError",
      "msg": "Error transfering tokens"
    },
    {
      "code": 6005,
      "name": "AlreadyInitialized",
      "msg": "Already initialized"
    },
    {
      "code": 6006,
      "name": "NothingToClaim",
      "msg": "Nothing to Claim"
    },
    {
      "code": 6007,
      "name": "MintError",
      "msg": "Error while trying to mint tokens"
    },
    {
      "code": 6008,
      "name": "NotOwner",
      "msg": "Is not owner"
    },
    {
      "code": 6009,
      "name": "InactivePool",
      "msg": "Inactive pool"
    }
  ]
};

export const IDL: ChirpStaking = {
  "version": "0.1.0",
  "name": "chirp_staking",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createPool",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "newPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "u8"
        },
        {
          "name": "lockDuration",
          "type": "i64"
        },
        {
          "name": "rewardBasis",
          "type": "u32"
        }
      ]
    },
    {
      "name": "stake",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "positionVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "positionVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakingPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "enableDisablePool",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "u8"
        },
        {
          "name": "activeStatus",
          "type": "bool"
        }
      ]
    },
    {
      "name": "updatePoolLock",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "u8"
        },
        {
          "name": "lockDuration",
          "type": "i64"
        }
      ]
    },
    {
      "name": "updatePoolReward",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "u8"
        },
        {
          "name": "rewardBasis",
          "type": "u32"
        }
      ]
    },
    {
      "name": "allPoolActiveStatus",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "status",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalStaked",
            "type": "u64"
          },
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "totalPools",
            "type": "u8"
          },
          {
            "name": "poolsEnabled",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "u8"
          },
          {
            "name": "poolStaked",
            "type": "u64"
          },
          {
            "name": "lockDuration",
            "type": "i64"
          },
          {
            "name": "rewardBasis",
            "type": "u32"
          },
          {
            "name": "isActive",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "stakingPosition",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakedAmount",
            "type": "u64"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "lockAmount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "CreatePoolEvent",
      "fields": [
        {
          "name": "poolId",
          "type": "u8",
          "index": false
        },
        {
          "name": "lockDuration",
          "type": "i64",
          "index": false
        },
        {
          "name": "rewardBasis",
          "type": "u32",
          "index": false
        }
      ]
    },
    {
      "name": "UserStakedEvent",
      "fields": [
        {
          "name": "poolId",
          "type": "u8",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UserUnstakedEvent",
      "fields": [
        {
          "name": "poolId",
          "type": "u8",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardAmount",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidInputValues",
      "msg": "Check input values"
    },
    {
      "code": 6001,
      "name": "InvalidPoolId",
      "msg": "Invalid pool id"
    },
    {
      "code": 6002,
      "name": "InvalidTokenAccount",
      "msg": "Invalid token account"
    },
    {
      "code": 6003,
      "name": "NoTokens",
      "msg": "No tokens"
    },
    {
      "code": 6004,
      "name": "TransferError",
      "msg": "Error transfering tokens"
    },
    {
      "code": 6005,
      "name": "AlreadyInitialized",
      "msg": "Already initialized"
    },
    {
      "code": 6006,
      "name": "NothingToClaim",
      "msg": "Nothing to Claim"
    },
    {
      "code": 6007,
      "name": "MintError",
      "msg": "Error while trying to mint tokens"
    },
    {
      "code": 6008,
      "name": "NotOwner",
      "msg": "Is not owner"
    },
    {
      "code": 6009,
      "name": "InactivePool",
      "msg": "Inactive pool"
    }
  ]
};