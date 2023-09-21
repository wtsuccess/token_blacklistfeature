// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ACME is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    event BlacklistSettled(address indexed user);
    event WhitelistSettled(address indexed user);

    mapping(address => bool) public isBlacklisted;

    function initialize(uint256 _initialSupply) public initializer {
        __Ownable_init();
        _mint(msg.sender, _initialSupply * 10 ** 18);
    }

    modifier onlyWhiteList(address from, address to) {
        require(!isBlacklisted[from], "Sender Blacklisted");
        require(!isBlacklisted[to], "Receiver Blacklisted");
        _;
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override onlyWhiteList(from, to) {
        super._transfer(from, to, amount);
    }

    function setBlacklist(address _user) public onlyOwner {
        require(!isBlacklisted[_user], "User already blacklisted");
        isBlacklisted[_user] = true;
        emit BlacklistSettled(_user);
    }

    function setWhitelist(address _user) public onlyOwner {
        require(isBlacklisted[_user], "User already whitelisted");
        isBlacklisted[_user] = false;
        emit WhitelistSettled(_user);
    }
}
