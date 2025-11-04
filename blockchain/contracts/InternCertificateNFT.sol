// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract InternCertificateNFT is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    Counters.Counter private _tokenIdCounter;

    struct Certificate {
        uint256 tokenId;
        string metadataURI;
        bytes32 metadataHash;
        uint256 issuedAt;
        bool revoked;
        address recipient;
    }

    mapping(uint256 => Certificate) public certificates;
    mapping(uint256 => bool) public revokedCertificates;
    mapping(bytes32 => uint256) public metadataHashToTokenId;

    event CertificateIssued(
        address indexed to,
        uint256 indexed tokenId,
        string uri,
        bytes32 metadataHash
    );

    event CertificateRevoked(uint256 indexed tokenId, address indexed revoker);

    constructor() ERC721("Aryan Internship Certificate", "ACERT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
    }

    function mintCertificate(
        address receiver,
        string memory metadataURI,
        bytes32 metadataHash
    ) public onlyRole(ISSUER_ROLE) returns (uint256) {
        require(receiver != address(0), "Invalid receiver address");
        require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");
        require(metadataHash != bytes32(0), "Invalid metadata hash");
        require(metadataHashToTokenId[metadataHash] == 0, "Certificate already exists");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(receiver, tokenId);
        _setTokenURI(tokenId, metadataURI);

        certificates[tokenId] = Certificate({
            tokenId: tokenId,
            metadataURI: metadataURI,
            metadataHash: metadataHash,
            issuedAt: block.timestamp,
            revoked: false,
            recipient: receiver
        });

        metadataHashToTokenId[metadataHash] = tokenId;

        emit CertificateIssued(receiver, tokenId, metadataURI, metadataHash);

        return tokenId;
    }

    function batchMint(
        address[] memory receivers,
        string[] memory metadataURIs,
        bytes32[] memory metadataHashes
    ) public onlyRole(ISSUER_ROLE) returns (uint256[] memory) {
        require(
            receivers.length == metadataURIs.length &&
            receivers.length == metadataHashes.length,
            "Arrays length mismatch"
        );
        require(receivers.length > 0, "Empty batch");
        require(receivers.length <= 50, "Batch too large");

        uint256[] memory tokenIds = new uint256[](receivers.length);

        for (uint256 i = 0; i < receivers.length; i++) {
            tokenIds[i] = mintCertificate(receivers[i], metadataURIs[i], metadataHashes[i]);
        }

        return tokenIds;
    }

    function revokeCertificate(uint256 tokenId) public onlyRole(ISSUER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Certificate does not exist");
        require(!certificates[tokenId].revoked, "Certificate already revoked");

        certificates[tokenId].revoked = true;
        revokedCertificates[tokenId] = true;

        emit CertificateRevoked(tokenId, msg.sender);
    }

    function verifyCertificate(uint256 tokenId)
        public
        view
        returns (
            bool exists,
            bool revoked,
            address recipient,
            string memory metadataURI,
            bytes32 metadataHash,
            uint256 issuedAt
        )
    {
        exists = _ownerOf(tokenId) != address(0);

        if (exists) {
            Certificate memory cert = certificates[tokenId];
            return (
                true,
                cert.revoked,
                cert.recipient,
                cert.metadataURI,
                cert.metadataHash,
                cert.issuedAt
            );
        }

        return (false, false, address(0), "", bytes32(0), 0);
    }

    function verifyCertificateByHash(bytes32 metadataHash)
        public
        view
        returns (
            bool exists,
            uint256 tokenId,
            bool revoked,
            address recipient
        )
    {
        tokenId = metadataHashToTokenId[metadataHash];
        exists = tokenId != 0;

        if (exists) {
            Certificate memory cert = certificates[tokenId];
            return (true, tokenId, cert.revoked, cert.recipient);
        }

        return (false, 0, false, address(0));
    }

    function getCertificatesByOwner(address owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 counter = 0;

        for (uint256 i = 1; i <= _tokenIdCounter.current(); i++) {
            if (_ownerOf(i) == owner) {
                tokenIds[counter] = i;
                counter++;
            }
        }

        return tokenIds;
    }

    function getTotalCertificates() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}
