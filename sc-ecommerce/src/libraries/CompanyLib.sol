/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

library CompanyLib {
    struct Company {
        uint256 id;
        address owner;
        string name;
        string description;
        bool isActive;
        uint256 createdAt;
    }

    struct CompanyStorage {
        mapping(uint256 => Company) company;
        mapping(address => uint256) companyByOwner;
        uint256 nextCompanyId;
    }

    event CompanyRegistered(uint256 indexed companyId, address indexed owner, string name);
    event CompanyStatusChanged(uint256 indexed companyId, bool isActive);

    function registerCompany(CompanyStorage storage self, address owner, string memory name, string memory description)
        external
        returns (uint256)
    {
        // Use post-increment to generate ID
        uint256 companyId = ++self.nextCompanyId;

        self.company[companyId] = Company(companyId, owner, name, description, true, block.timestamp);
        self.companyByOwner[owner] = companyId;

        emit CompanyRegistered(companyId, owner, name);
        return companyId;
    }

    function deactivateCompany(CompanyStorage storage self, uint256 companyId) external {
        require(self.company[companyId].id != 0, "Company does not exist");
        require(self.company[companyId].isActive, "Company already inactive");

        self.company[companyId].isActive = false;

        emit CompanyStatusChanged(companyId, false);
    }

    function activateCompany(CompanyStorage storage self, uint256 companyId) external {
        require(self.company[companyId].id != 0, "Company does not exist");
        require(!self.company[companyId].isActive, "Company already active");

        self.company[companyId].isActive = true;

        emit CompanyStatusChanged(companyId, true);
    }

    function getCompany(CompanyStorage storage self, uint256 companyId) external view returns (Company memory) {
        return self.company[companyId];
    }

    function getCompanyByOwner(CompanyStorage storage self, address owner) external view returns (Company memory) {
        uint256 companyId = self.companyByOwner[owner];
        return self.company[companyId];
    }

    function isCompanyActive(CompanyStorage storage self, uint256 companyId) external view returns (bool) {
        return self.company[companyId].isActive;
    }

    function getAllCompanies(CompanyStorage storage self) 
        external view returns (uint256[] memory) 
    {
        uint256[] memory allCompanies = new uint256[](self.nextCompanyId);
        uint256 count = 0;
        for (uint256 i = 1; i <= self.nextCompanyId; i++) {
            if (self.company[i].id != 0) {
                allCompanies[count] = i;
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = allCompanies[i];
        }
        return result;
    }
}
