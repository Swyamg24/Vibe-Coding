// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IdentityManager
 * @dev A smart contract for users to claim and manage their own identity credentials.
 * Credentials are a string, typically an IPFS CID pointing to a document.
 */
contract IdentityManager {
    
    // A mapping from a user's address to their credential CID.
    // 'public' creates a getter function automatically.
    mapping(address => string) public userCredentials;

    // An event that is emitted when a credential is claimed or updated.
    event CredentialClaimed(address indexed user, string cid);

    /**
     * @dev Allows a user to claim or update their credential.
     * The credential is a string, expected to be an IPFS CID.
     * @param _cid The IPFS Content Identifier for the user's credential document.
     */
    function claimCredential(string memory _cid) public {
        // Ensure the CID is not empty.
        require(bytes(_cid).length > 0, "CID cannot be empty");

        // The sender of the transaction (msg.sender) is the user claiming the credential.
        address user = msg.sender;

        // Store the CID, linking it to the user's address.
        userCredentials[user] = _cid;

        // Emit an event to notify listeners (like your dApp frontend) that a credential was claimed.
        emit CredentialClaimed(user, _cid);
    }

    /**
     * @dev Allows anyone to view the credential CID for a given user address.
     * Note: The 'public' keyword on the mapping already creates this getter,
     * but having an explicit function can sometimes be clearer.
     * @param _user The address of the user whose credential we want to view.
     * @return The IPFS CID string of the user's credential.
     */
    function viewCredential(address _user) public view returns (string memory) {
        return userCredentials[_user];
    }
}