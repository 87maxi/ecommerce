/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

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
        mapping(uint256 => Company) companies;
        mapping(address => uint256) companyByOwner;
        uint256 nextCompanyId;
    }

    event CompanyRegistered(uint256 indexed companyId, address indexed owner, string name);
    event CompanyStatusChanged(uint256 indexed companyId, bool isActive);

    function registerCompany(
        CompanyStorage storage self,
        address owner,
        string memory name,
        string memory description
    ) external returns (uint256) {
        uint256 companyId = self.nextCompanyId;

        self.companies[companyId] = Company(
            companyId,
            owner,
            name,
            description,
            true,
            block.timestamp
        );
        self.companyByOwner[owner] = companyId;
        self.nextCompanyId++;

        emit CompanyRegistered(companyId, owner, name);
        return companyId;
    }

    function deactivateCompany(CompanyStorage storage self, uint256 companyId) external {
        require(self.companies[companyId].id != 0, "Company does not exist");
        require(self.companies[companyId].isActive, "Company already inactive");
        
        self.companies[companyId].isActive = false;
        
        emit CompanyStatusChanged(companyId, false);
    }

    function activateCompany(CompanyStorage storage self, uint256 companyId) external {
        require(self.companies[companyId].id != 0, "Company does not exist");
        require(!self.companies[companyId].isActive, "Company already active");
        
        self.companies[companyId].isActive = true;
        
        emit CompanyStatusChanged(companyId, true);
    }

    function getCompany(CompanyStorage storage self, uint256 companyId)
        external
        view
        returns (Company memory)
    {
        return self.companies[companyId];
    }

    function getCompanyByOwner(CompanyStorage storage self, address owner)
        external
        view
        returns (Company memory)
    {
        uint256 companyId = self.companyByOwner[owner];
        return self.companies[companyId];
    }

    function isCompanyActive(CompanyStorage storage self, uint256 companyId)
        external
        view
        returns (bool)
    {
        return self.companies[companyId].isActive;
    }
}