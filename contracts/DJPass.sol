// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title BlockTek DJ Pass
 * @notice ERC721A NFT that grants DJ privileges on BlockTek Radio
 * @dev Gas-efficient batch minting via ERC721A
 */
contract DJPass is ERC721A, Ownable {
    using Strings for uint256;

    uint256 public constant MINT_PRICE = 0.01 ether;
    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public constant MAX_PER_WALLET = 5;

    string private _baseTokenURI;
    bool public mintActive = true;

    event Minted(address indexed minter, uint256 quantity, uint256 firstTokenId);

    constructor(string memory baseURI) ERC721A("BlockTek DJ Pass", "BTDJ") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    /**
     * @notice Mint DJ Pass NFTs
     * @param quantity Number of tokens to mint (1-5)
     */
    function mint(uint256 quantity) external payable {
        require(mintActive, "Minting is paused");
        require(quantity > 0 && quantity <= MAX_PER_WALLET, "Invalid quantity");
        require(totalSupply() + quantity <= MAX_SUPPLY, "Exceeds max supply");
        require(_numberMinted(msg.sender) + quantity <= MAX_PER_WALLET, "Exceeds wallet limit");
        require(msg.value >= MINT_PRICE * quantity, "Not enough ETH");

        uint256 startTokenId = _nextTokenId();
        _safeMint(msg.sender, quantity);
        emit Minted(msg.sender, quantity, startTokenId);
    }

    /**
     * @notice Toggle minting
     */
    function setMintActive(bool active) external onlyOwner {
        mintActive = active;
    }

    /**
     * @notice Set base URI for metadata
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @notice Withdraw contract balance to owner
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @notice Get number of tokens minted by an address
     */
    function numberMinted(address owner) external view returns (uint256) {
        return _numberMinted(owner);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 
            ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
            : "";
    }

    /**
     * @notice Start token IDs at 1 instead of 0
     */
    function _startTokenId() internal pure override returns (uint256) {
        return 1;
    }
}