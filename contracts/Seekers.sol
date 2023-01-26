// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Basic ERC721 contract with an unrestricted mint function.
// Useful for mimicking the Seekers ERC721 contract for testing
// purposes.
contract TestSeekers is ERC721 {
  string _tokenUriBase;

  constructor() ERC721("Seekers", "SEEKERS") {}

  function mint(address to, uint256 tokenId) external {
    _safeMint(to, tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721)
    returns (string memory)
  {
    return string(abi.encodePacked(baseTokenURI(), Strings.toString(tokenId)));
  }

  function baseTokenURI() public view virtual returns (string memory) {
    return _tokenUriBase;
  }

  function setTokenURI(string memory tokenUriBase_) external {
    _tokenUriBase = tokenUriBase_;
  }
}
