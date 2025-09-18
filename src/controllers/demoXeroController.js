const sampleXeroData = {
  "organization": [
    {
      "OrganisationID": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "Name": "Demo Company Ltd",
      "LegalName": "Demo Company Limited",
      "PaysTax": true,
      "Version": "AU",
      "OrganisationType": "COMPANY",
      "BaseCurrency": "AUD",
      "CountryCode": "AU",
      "IsDemoCompany": true,
      "OrganisationStatus": "ACTIVE",
      "RegistrationNumber": "123456789",
      "TaxNumber": "12345678901",
      "FinancialYearEndDay": 30,
      "FinancialYearEndMonth": 6,
      "SalesTaxBasis": "ACCRUALS",
      "SalesTaxPeriod": "QUARTERLY",
      "DefaultSalesTax": "GST on Income",
      "DefaultPurchasesTax": "GST on Expenses",
      "PeriodLockDate": "2024-06-30T00:00:00",
      "EndOfYearLockDate": "2024-06-30T00:00:00",
      "CreatedDateUTC": "2023-01-15T00:00:00Z",
      "Timezone": "AUSEASTERNSTANDARDTIME"
    }
  ],
  "contacts": [
    {
      "ContactID": "contact-001-4v6rer9z5",
      "ContactStatus": "ACTIVE",
      "Name": "Advanced Pty Ltd",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@advancedptyltd.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678901",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "882 Advanced Street",
          "City": "Adelaide",
          "Region": "SA",
          "PostalCode": "2239",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "03 3183 1827"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-02-26T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-002-behk3mo4j",
      "ContactStatus": "ACTIVE",
      "Name": "Digital Group",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@digitalgroup.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678902",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "167 Digital Street",
          "City": "Brisbane",
          "Region": "QLD",
          "PostalCode": "3702",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "05 6547 5762"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-05-03T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-003-s0njqtfb2",
      "ContactStatus": "ACTIVE",
      "Name": "Creative Industries",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@creativeindustries.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678903",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "344 Creative Street",
          "City": "Darwin",
          "Region": "NT",
          "PostalCode": "1952",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "07 3158 5005"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-12-07T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-004-hrmg6f23q",
      "ContactStatus": "ACTIVE",
      "Name": "Dynamic Pty Ltd",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@dynamicptyltd.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678904",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "921 Dynamic Street",
          "City": "Perth",
          "Region": "WA",
          "PostalCode": "3231",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "02 8594 8888"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-10-10T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-005-m9g4zk5kl",
      "ContactStatus": "ACTIVE",
      "Name": "Trusted Corp",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@trustedcorp.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678905",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "808 Trusted Street",
          "City": "Darwin",
          "Region": "NT",
          "PostalCode": "4940",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "03 6351 9282"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-06-18T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-006-6cq4am88i",
      "ContactStatus": "ACTIVE",
      "Name": "Innovative Enterprises",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@innovativeenterprises.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678906",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "721 Innovative Street",
          "City": "Sydney",
          "Region": "NSW",
          "PostalCode": "6855",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "06 7219 1887"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-01-12T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-007-hbrt8txme",
      "ContactStatus": "ACTIVE",
      "Name": "Quality Ltd",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@qualityltd.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678907",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "506 Quality Street",
          "City": "Sydney",
          "Region": "NSW",
          "PostalCode": "6792",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "05 3543 3894"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-01-01T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-008-19ahfsnzk",
      "ContactStatus": "ACTIVE",
      "Name": "Digital Group",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@digitalgroup.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678908",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "306 Digital Street",
          "City": "Perth",
          "Region": "WA",
          "PostalCode": "8316",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "05 7595 3029"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-04-04T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-009-8i97he5za",
      "ContactStatus": "ACTIVE",
      "Name": "Quality Ltd",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@qualityltd.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678909",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "146 Quality Street",
          "City": "Sydney",
          "Region": "NSW",
          "PostalCode": "9101",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "04 3713 1739"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-08-16T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-010-bz0xwqtpu",
      "ContactStatus": "ACTIVE",
      "Name": "Trusted Services",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@trustedservices.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678910",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "781 Trusted Street",
          "City": "Darwin",
          "Region": "NT",
          "PostalCode": "1576",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "04 9056 3928"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-05-28T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-011-xplgz8vf9",
      "ContactStatus": "ACTIVE",
      "Name": "Tech Enterprises",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@techenterprises.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678911",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "757 Tech Street",
          "City": "Melbourne",
          "Region": "VIC",
          "PostalCode": "9110",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "02 1747 7324"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-10-12T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-012-a0v8xcoef",
      "ContactStatus": "ACTIVE",
      "Name": "Tech Services",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@techservices.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678912",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "461 Tech Street",
          "City": "Canberra",
          "Region": "ACT",
          "PostalCode": "3303",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "06 5619 7822"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-06-02T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-013-34vim9k4l",
      "ContactStatus": "ACTIVE",
      "Name": "Advanced Corp",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@advancedcorp.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678913",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "826 Advanced Street",
          "City": "Perth",
          "Region": "WA",
          "PostalCode": "6391",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "09 6027 3606"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-06-11T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-014-n0r4pa3hv",
      "ContactStatus": "ACTIVE",
      "Name": "Global Industries",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@globalindustries.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678914",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "503 Global Street",
          "City": "Perth",
          "Region": "WA",
          "PostalCode": "8951",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "01 5803 8126"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-08-10T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-015-ix1l6fsy9",
      "ContactStatus": "ACTIVE",
      "Name": "Reliable Services",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@reliableservices.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678915",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "667 Reliable Street",
          "City": "Brisbane",
          "Region": "QLD",
          "PostalCode": "7898",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "03 4643 4039"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-07-22T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-016-njaz1u8if",
      "ContactStatus": "ACTIVE",
      "Name": "Tech Services",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@techservices.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678916",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "213 Tech Street",
          "City": "Darwin",
          "Region": "NT",
          "PostalCode": "4831",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "05 2476 2082"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-03-16T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-017-dub5osg65",
      "ContactStatus": "ACTIVE",
      "Name": "Global Corp",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@globalcorp.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678917",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "701 Global Street",
          "City": "Brisbane",
          "Region": "QLD",
          "PostalCode": "1549",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "09 1764 6970"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-10-18T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-018-1svfp1ixh",
      "ContactStatus": "ACTIVE",
      "Name": "Leading Pty Ltd",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@leadingptyltd.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678918",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "857 Leading Street",
          "City": "Brisbane",
          "Region": "QLD",
          "PostalCode": "1422",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "06 9317 3884"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-09-06T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-019-tdrljri1y",
      "ContactStatus": "ACTIVE",
      "Name": "Elite Industries",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@eliteindustries.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678919",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "418 Elite Street",
          "City": "Adelaide",
          "Region": "SA",
          "PostalCode": "9844",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "03 8399 3033"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-11-24T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-020-2de2lafpr",
      "ContactStatus": "ACTIVE",
      "Name": "Strategic Group",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@strategicgroup.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678920",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "463 Strategic Street",
          "City": "Adelaide",
          "Region": "SA",
          "PostalCode": "3054",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "05 7336 4205"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-07-06T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-021-6bx85x1x7",
      "ContactStatus": "ACTIVE",
      "Name": "Modern Services",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@modernservices.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678921",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "46 Modern Street",
          "City": "Darwin",
          "Region": "NT",
          "PostalCode": "2741",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "09 9134 2472"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-08-17T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-022-4ou0psek6",
      "ContactStatus": "ACTIVE",
      "Name": "Innovative Ltd",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@innovativeltd.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678922",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "609 Innovative Street",
          "City": "Darwin",
          "Region": "NT",
          "PostalCode": "5541",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "02 6647 7200"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-04-08T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-023-tz05yycjt",
      "ContactStatus": "ACTIVE",
      "Name": "Leading Enterprises",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@leadingenterprises.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678923",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "916 Leading Street",
          "City": "Canberra",
          "Region": "ACT",
          "PostalCode": "1983",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "03 7613 9075"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-10-12T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-024-6sigskx2x",
      "ContactStatus": "ACTIVE",
      "Name": "Smart Services",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@smartservices.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678924",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "254 Smart Street",
          "City": "Canberra",
          "Region": "ACT",
          "PostalCode": "5713",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "04 9495 8058"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-12-13T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-025-j3x2gappi",
      "ContactStatus": "ACTIVE",
      "Name": "Reliable Industries",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@reliableindustries.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678925",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "700 Reliable Street",
          "City": "Hobart",
          "Region": "TAS",
          "PostalCode": "6815",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "01 9419 2434"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-06-06T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-026-jf5zwtg9m",
      "ContactStatus": "ACTIVE",
      "Name": "Innovative Group",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@innovativegroup.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678926",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "96 Innovative Street",
          "City": "Brisbane",
          "Region": "QLD",
          "PostalCode": "6411",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "07 3327 8824"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-02-18T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-027-9f0hvj9qs",
      "ContactStatus": "ACTIVE",
      "Name": "Creative Pty Ltd",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@creativeptyltd.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678927",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "659 Creative Street",
          "City": "Canberra",
          "Region": "ACT",
          "PostalCode": "6897",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "08 2788 7008"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-07-18T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-028-28gclalra",
      "ContactStatus": "ACTIVE",
      "Name": "Dynamic Corp",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@dynamiccorp.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678928",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "948 Dynamic Street",
          "City": "Hobart",
          "Region": "TAS",
          "PostalCode": "5657",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "08 9069 2843"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-02-06T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-029-r1j7alvwk",
      "ContactStatus": "ACTIVE",
      "Name": "Advanced Holdings",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@advancedholdings.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678929",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "711 Advanced Street",
          "City": "Brisbane",
          "Region": "QLD",
          "PostalCode": "9363",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "05 2842 2439"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-12-16T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-030-5u5yn2y3i",
      "ContactStatus": "ACTIVE",
      "Name": "Premier Ltd",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@premierltd.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678930",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "406 Premier Street",
          "City": "Melbourne",
          "Region": "VIC",
          "PostalCode": "3303",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "06 9148 8101"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-10-28T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-031-42fbag9kv",
      "ContactStatus": "ACTIVE",
      "Name": "Smart Services",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@smartservices.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678931",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "363 Smart Street",
          "City": "Hobart",
          "Region": "TAS",
          "PostalCode": "6612",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "07 5183 8403"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-01-22T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-032-n1wb5sfy8",
      "ContactStatus": "ACTIVE",
      "Name": "Elite Corp",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@elitecorp.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678932",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "590 Elite Street",
          "City": "Adelaide",
          "Region": "SA",
          "PostalCode": "1622",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "08 1778 2580"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-12-18T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-033-fjy5qh7k9",
      "ContactStatus": "ACTIVE",
      "Name": "Strategic Pty Ltd",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@strategicptyltd.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678933",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "804 Strategic Street",
          "City": "Brisbane",
          "Region": "QLD",
          "PostalCode": "3693",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "01 1045 7888"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-12-18T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-034-2fdkup11o",
      "ContactStatus": "ACTIVE",
      "Name": "Creative Holdings",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@creativeholdings.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678934",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "842 Creative Street",
          "City": "Perth",
          "Region": "WA",
          "PostalCode": "9300",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "05 8417 5561"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-04-16T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-035-zbrlh7sd1",
      "ContactStatus": "ACTIVE",
      "Name": "Quality Solutions",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@qualitysolutions.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678935",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "749 Quality Street",
          "City": "Sydney",
          "Region": "NSW",
          "PostalCode": "7976",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "08 5984 8556"
        }
      ],
      "IsSupplier": false,
      "IsCustomer": true,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-01-07T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-036-7a8qgp5ps",
      "ContactStatus": "ACTIVE",
      "Name": "Excellence Solutions",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@excellencesolutions.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678936",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "595 Excellence Street",
          "City": "Canberra",
          "Region": "ACT",
          "PostalCode": "6321",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "09 5335 3283"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-10-11T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-037-119qehu0g",
      "ContactStatus": "ACTIVE",
      "Name": "Strategic Solutions",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@strategicsolutions.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678937",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "196 Strategic Street",
          "City": "Sydney",
          "Region": "NSW",
          "PostalCode": "4480",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "02 7542 8183"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-01-25T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-038-7gad457uf",
      "ContactStatus": "ACTIVE",
      "Name": "Prime Pty Ltd",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@primeptyltd.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678938",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "857 Prime Street",
          "City": "Canberra",
          "Region": "ACT",
          "PostalCode": "1696",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "01 2603 9644"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-01-05T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-039-apfd0pr2e",
      "ContactStatus": "ACTIVE",
      "Name": "Excellence Corp",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@excellencecorp.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678939",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "571 Excellence Street",
          "City": "Melbourne",
          "Region": "VIC",
          "PostalCode": "3247",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "08 6699 8995"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-05-14T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-040-ymjdq1xv7",
      "ContactStatus": "ACTIVE",
      "Name": "Smart Pty Ltd",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@smartptyltd.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678940",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "965 Smart Street",
          "City": "Canberra",
          "Region": "ACT",
          "PostalCode": "3243",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "06 5311 8405"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-07-04T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-041-na8ivhbyy",
      "ContactStatus": "ACTIVE",
      "Name": "Prime Holdings",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@primeholdings.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678941",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "485 Prime Street",
          "City": "Adelaide",
          "Region": "SA",
          "PostalCode": "4145",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "05 4356 8538"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-03-19T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-042-9xggt2d7f",
      "ContactStatus": "ACTIVE",
      "Name": "Professional Solutions",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@professionalsolutions.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678942",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "372 Professional Street",
          "City": "Brisbane",
          "Region": "QLD",
          "PostalCode": "6537",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "07 4843 2029"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-02-12T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-043-6bb6r44rf",
      "ContactStatus": "ACTIVE",
      "Name": "Digital Solutions",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@digitalsolutions.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678943",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "90 Digital Street",
          "City": "Melbourne",
          "Region": "VIC",
          "PostalCode": "5310",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "09 5681 6953"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-11-21T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-044-06it8g2rc",
      "ContactStatus": "ACTIVE",
      "Name": "Global Ltd",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@globalltd.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678944",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "274 Global Street",
          "City": "Darwin",
          "Region": "NT",
          "PostalCode": "2447",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "09 9126 9075"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-01-14T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-045-tq97g9xq7",
      "ContactStatus": "ACTIVE",
      "Name": "Reliable Enterprises",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@reliableenterprises.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678945",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "355 Reliable Street",
          "City": "Sydney",
          "Region": "NSW",
          "PostalCode": "6312",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "03 2682 6335"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-05-27T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-046-nbp6tyogi",
      "ContactStatus": "ACTIVE",
      "Name": "Prime Holdings",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@primeholdings.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678946",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "220 Prime Street",
          "City": "Perth",
          "Region": "WA",
          "PostalCode": "2416",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "03 2809 5691"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-05-08T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-047-6py6h990k",
      "ContactStatus": "ACTIVE",
      "Name": "Modern Industries",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@modernindustries.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678947",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "126 Modern Street",
          "City": "Adelaide",
          "Region": "SA",
          "PostalCode": "3440",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "03 5309 6606"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-10-20T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-048-1rnk3hjwo",
      "ContactStatus": "ACTIVE",
      "Name": "Trusted Ltd",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@trustedltd.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678948",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "943 Trusted Street",
          "City": "Perth",
          "Region": "WA",
          "PostalCode": "8709",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "03 5395 7705"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-11-23T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-049-l11dn6tgy",
      "ContactStatus": "ACTIVE",
      "Name": "Dynamic Solutions",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@dynamicsolutions.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678949",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "916 Dynamic Street",
          "City": "Brisbane",
          "Region": "QLD",
          "PostalCode": "5815",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "09 9952 1632"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-10-16T00:00:00Z",
      "HasAttachments": false
    },
    {
      "ContactID": "contact-050-2dcq4snb1",
      "ContactStatus": "ACTIVE",
      "Name": "Digital Solutions",
      "FirstName": "",
      "LastName": "",
      "EmailAddress": "info@digitalsolutions.com.au",
      "ContactPersons": [],
      "BankAccountDetails": "",
      "TaxNumber": "12345678950",
      "AccountsReceivableTaxType": "GST on Income",
      "AccountsPayableTaxType": "GST on Expenses",
      "Addresses": [
        {
          "AddressType": "STREET",
          "AddressLine1": "854 Digital Street",
          "City": "Darwin",
          "Region": "NT",
          "PostalCode": "4525",
          "Country": "Australia"
        }
      ],
      "Phones": [
        {
          "PhoneType": "DEFAULT",
          "PhoneNumber": "01 3319 1354"
        }
      ],
      "IsSupplier": true,
      "IsCustomer": false,
      "DefaultCurrency": "AUD",
      "UpdatedDateUTC": "2024-02-01T00:00:00Z",
      "HasAttachments": false
    }
  ],
  "accounts": [
    {
      "AccountID": "account-001-sudgzghq8",
      "Code": "200",
      "Name": "Sales",
      "Type": "REVENUE",
      "TaxType": "GST on Income",
      "Description": "Sales Revenue",
      "Class": "REVENUE",
      "SystemAccount": "SALES",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": false,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-02-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-002-wt36u2c4i",
      "Code": "260",
      "Name": "Other Revenue",
      "Type": "REVENUE",
      "TaxType": "GST on Income",
      "Description": "Other Revenue Sources",
      "Class": "REVENUE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": false,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-10-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-003-8n34xvdce",
      "Code": "400",
      "Name": "Advertising",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Advertising and Marketing",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-08-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-004-4b0qc8iwz",
      "Code": "404",
      "Name": "Bank Fees",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Bank Fees and Charges",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-09-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-005-crkl5r7f4",
      "Code": "408",
      "Name": "Cleaning",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Cleaning Services",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-05-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-006-sejuosv8g",
      "Code": "412",
      "Name": "Consulting",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Consulting and Professional Fees",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-04-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-007-a4ca51vad",
      "Code": "420",
      "Name": "Entertainment",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Entertainment Expenses",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-11-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-008-vo3zdza9s",
      "Code": "429",
      "Name": "General Expenses",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "General Business Expenses",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-09-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-009-ddvgdt2sk",
      "Code": "433",
      "Name": "Insurance",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Insurance Premiums",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-09-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-010-oqmeatjtb",
      "Code": "449",
      "Name": "Legal expenses",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Legal and Professional Fees",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-05-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-011-e9vanjlq7",
      "Code": "453",
      "Name": "Light, Power, Heating",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Utilities",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-01-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-012-cqcxtwq1m",
      "Code": "461",
      "Name": "Motor Vehicle Expenses",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Vehicle Running Costs",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-09-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-013-37nygo944",
      "Code": "469",
      "Name": "Office Expenses",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Office Supplies and Equipment",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-12-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-014-vneyynxyd",
      "Code": "477",
      "Name": "Printing & Stationery",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Printing and Stationery",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-12-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-015-b7xghh9a1",
      "Code": "485",
      "Name": "Rent",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Rent and Lease Payments",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-11-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-016-3wbb8o2lc",
      "Code": "493",
      "Name": "Repairs and Maintenance",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Repairs and Maintenance",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-01-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-017-z21ojqt01",
      "Code": "505",
      "Name": "Subscriptions",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Subscriptions and Memberships",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-08-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-018-oq0j5hldf",
      "Code": "513",
      "Name": "Telephone & Internet",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Telecommunications",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-11-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-019-ojxu24nn7",
      "Code": "521",
      "Name": "Training & Development",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Staff Training",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-10-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-020-fzb5k4dpv",
      "Code": "529",
      "Name": "Travel - National",
      "Type": "EXPENSE",
      "TaxType": "GST on Expenses",
      "Description": "Domestic Travel",
      "Class": "EXPENSE",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": true,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-04-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-021-gujngn24j",
      "Code": "090",
      "Name": "Business Bank Account",
      "Type": "BANK",
      "TaxType": "GST Free",
      "Description": "Primary Business Account",
      "Class": "BANK",
      "SystemAccount": "",
      "EnablePaymentsToAccount": true,
      "ShowInExpenseClaims": false,
      "BankAccountNumber": "979614756",
      "BankAccountType": "BANK",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-09-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-022-kiv6dvjcl",
      "Code": "091",
      "Name": "Petty Cash",
      "Type": "CURRENT",
      "TaxType": "GST Free",
      "Description": "Petty Cash Account",
      "Class": "CURRENT",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": false,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-10-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-023-bv9cxyjv4",
      "Code": "610",
      "Name": "Accounts Receivable",
      "Type": "CURRENT",
      "TaxType": "GST Free",
      "Description": "Trade Debtors",
      "Class": "CURRENT",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": false,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-06-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-024-b6m907e13",
      "Code": "620",
      "Name": "Inventory",
      "Type": "CURRENT",
      "TaxType": "GST Free",
      "Description": "Stock on Hand",
      "Class": "CURRENT",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": false,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-11-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-025-owf2r3muq",
      "Code": "630",
      "Name": "GST",
      "Type": "CURRENT",
      "TaxType": "GST Free",
      "Description": "GST Control Account",
      "Class": "CURRENT",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": false,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-09-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-026-scard5se3",
      "Code": "800",
      "Name": "Accounts Payable",
      "Type": "CURRENT",
      "TaxType": "GST Free",
      "Description": "Trade Creditors",
      "Class": "CURRENT",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": false,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-02-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-027-jn6z73nra",
      "Code": "825",
      "Name": "Accrued Expenses",
      "Type": "CURRENT",
      "TaxType": "GST Free",
      "Description": "Accrued Liabilities",
      "Class": "CURRENT",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": false,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-03-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-028-z810dc5ik",
      "Code": "850",
      "Name": "PAYG Withholdings Payable",
      "Type": "CURRENT",
      "TaxType": "GST Free",
      "Description": "PAYG Tax Payable",
      "Class": "CURRENT",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": false,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-07-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-029-8zatfvo1n",
      "Code": "855",
      "Name": "Superannuation Payable",
      "Type": "CURRENT",
      "TaxType": "GST Free",
      "Description": "Super Contributions Payable",
      "Class": "CURRENT",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": false,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-06-15T00:00:00Z",
      "AddToWatchlist": false
    },
    {
      "AccountID": "account-030-l29vr6v4w",
      "Code": "860",
      "Name": "Wages Payable",
      "Type": "CURRENT",
      "TaxType": "GST Free",
      "Description": "Wages and Salaries Payable",
      "Class": "CURRENT",
      "SystemAccount": "",
      "EnablePaymentsToAccount": false,
      "ShowInExpenseClaims": false,
      "BankAccountNumber": "",
      "BankAccountType": "",
      "CurrencyCode": "AUD",
      "ReportingCode": "",
      "ReportingCodeName": "",
      "HasAttachments": false,
      "UpdatedDateUTC": "2024-09-15T00:00:00Z",
      "AddToWatchlist": false
    }
  ],
  "invoices": [
    {
      "InvoiceID": "invoice-001-e0derdt57",
      "InvoiceNumber": "INV-2024-001",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-023-tz05yycjt",
        "Name": "Leading Enterprises"
      },
      "Date": "2025-07-28",
      "DueDate": "2025-08-27",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-1-rjinw5xeb",
          "Description": "Professional Services - Invoice 1",
          "Quantity": 5,
          "UnitAmount": 647,
          "LineAmount": 6477,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 6477,
      "TotalTax": 647,
      "Total": 7124,
      "AmountDue": 0,
      "AmountPaid": 7124,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-07-28",
      "Reference": "Project O35",
      "BrandingThemeID": "brand-yipkr5x08",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=mttn3bndo",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-28T07:11:00Z"
    },
    {
      "InvoiceID": "invoice-002-cb0aal6gc",
      "InvoiceNumber": "INV-2024-002",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-001-4v6rer9z5",
        "Name": "Advanced Pty Ltd"
      },
      "Date": "2025-08-17",
      "DueDate": "2025-09-16",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-2-dr6fqbpwo",
          "Description": "Professional Services - Invoice 2",
          "Quantity": 5,
          "UnitAmount": 356,
          "LineAmount": 6063,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 6063,
      "TotalTax": 606,
      "Total": 6669,
      "AmountDue": 0,
      "AmountPaid": 6669,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-17",
      "Reference": "Project P70",
      "BrandingThemeID": "brand-f01nuuv8c",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=htibmy60n",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-17T18:17:00Z"
    },
    {
      "InvoiceID": "invoice-003-2kati2g7v",
      "InvoiceNumber": "INV-2024-003",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-032-n1wb5sfy8",
        "Name": "Elite Corp"
      },
      "Date": "2025-06-25",
      "DueDate": "2025-07-25",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-3-m5pp5754j",
          "Description": "Professional Services - Invoice 3",
          "Quantity": 18,
          "UnitAmount": 828,
          "LineAmount": 5801,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 5801,
      "TotalTax": 580,
      "Total": 6381,
      "AmountDue": 6381,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project L22",
      "BrandingThemeID": "brand-9nh9c18f1",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=o32el12o6",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-07-25",
      "PlannedPaymentDate": "2025-07-25",
      "HasAttachments": true,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-06-25T04:10:00Z"
    },
    {
      "InvoiceID": "invoice-004-vr7m3uons",
      "InvoiceNumber": "INV-2024-004",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-004-hrmg6f23q",
        "Name": "Dynamic Pty Ltd"
      },
      "Date": "2025-08-20",
      "DueDate": "2025-09-19",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-4-juo5fvbyx",
          "Description": "Professional Services - Invoice 4",
          "Quantity": 15,
          "UnitAmount": 46,
          "LineAmount": 703,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 703,
      "TotalTax": 70,
      "Total": 773,
      "AmountDue": 0,
      "AmountPaid": 773,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-20",
      "Reference": "Project D59",
      "BrandingThemeID": "brand-h909xy14k",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=ur7xarfyz",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-20T00:22:00Z"
    },
    {
      "InvoiceID": "invoice-005-dkuho0pru",
      "InvoiceNumber": "INV-2024-005",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-007-hbrt8txme",
        "Name": "Quality Ltd"
      },
      "Date": "2025-08-06",
      "DueDate": "2025-09-05",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-5-xcunjb8nk",
          "Description": "Professional Services - Invoice 5",
          "Quantity": 6,
          "UnitAmount": 648,
          "LineAmount": 5187,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 5187,
      "TotalTax": 518,
      "Total": 5705,
      "AmountDue": 0,
      "AmountPaid": 5705,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-06",
      "Reference": "Project M44",
      "BrandingThemeID": "brand-fe8ktshst",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=00uh28ezj",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-06T03:38:00Z"
    },
    {
      "InvoiceID": "invoice-006-ahxj1ovxo",
      "InvoiceNumber": "INV-2024-006",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-005-m9g4zk5kl",
        "Name": "Trusted Corp"
      },
      "Date": "2025-07-18",
      "DueDate": "2025-08-17",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-6-7j5xvx2r1",
          "Description": "Professional Services - Invoice 6",
          "Quantity": 16,
          "UnitAmount": 257,
          "LineAmount": 2578,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 2578,
      "TotalTax": 257,
      "Total": 2835,
      "AmountDue": 2835,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project L39",
      "BrandingThemeID": "brand-4js21766p",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=5kqob12tg",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": true,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-18T15:36:00Z"
    },
    {
      "InvoiceID": "invoice-007-f3vvbsany",
      "InvoiceNumber": "INV-2024-007",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-014-n0r4pa3hv",
        "Name": "Global Industries"
      },
      "Date": "2025-07-16",
      "DueDate": "2025-08-15",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-7-q32ggutxz",
          "Description": "Professional Services - Invoice 7",
          "Quantity": 17,
          "UnitAmount": 2206,
          "LineAmount": 4412,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 4412,
      "TotalTax": 441,
      "Total": 4853,
      "AmountDue": 4853,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project D26",
      "BrandingThemeID": "brand-5sh66yc8d",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=efdmed9gz",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-16T07:12:00Z"
    },
    {
      "InvoiceID": "invoice-008-ambdk1jqy",
      "InvoiceNumber": "INV-2024-008",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-004-hrmg6f23q",
        "Name": "Dynamic Pty Ltd"
      },
      "Date": "2025-07-28",
      "DueDate": "2025-08-27",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-8-yg4vxigqh",
          "Description": "Professional Services - Invoice 8",
          "Quantity": 2,
          "UnitAmount": 780,
          "LineAmount": 8584,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 8584,
      "TotalTax": 858,
      "Total": 9442,
      "AmountDue": 9442,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project H64",
      "BrandingThemeID": "brand-oyp8ipv0u",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=dpj3hxpi3",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-08-27",
      "PlannedPaymentDate": "2025-08-27",
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-28T09:38:00Z"
    },
    {
      "InvoiceID": "invoice-009-35773elqo",
      "InvoiceNumber": "INV-2024-009",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-034-2fdkup11o",
        "Name": "Creative Holdings"
      },
      "Date": "2025-07-28",
      "DueDate": "2025-08-27",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-9-v3s0al3m6",
          "Description": "Professional Services - Invoice 9",
          "Quantity": 11,
          "UnitAmount": 67,
          "LineAmount": 949,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 949,
      "TotalTax": 94,
      "Total": 1043,
      "AmountDue": 0,
      "AmountPaid": 1043,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-07-28",
      "Reference": "Project B33",
      "BrandingThemeID": "brand-elms5o8bb",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=dssgfr5jl",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-28T15:53:00Z"
    },
    {
      "InvoiceID": "invoice-010-uk9pchnc7",
      "InvoiceNumber": "INV-2024-010",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-007-hbrt8txme",
        "Name": "Quality Ltd"
      },
      "Date": "2025-07-09",
      "DueDate": "2025-08-08",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-10-r85mdn2ni",
          "Description": "Professional Services - Invoice 10",
          "Quantity": 16,
          "UnitAmount": 553,
          "LineAmount": 8306,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 8306,
      "TotalTax": 830,
      "Total": 9136,
      "AmountDue": 9136,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project A85",
      "BrandingThemeID": "brand-q1opino7q",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=lo9k4q34a",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-08-08",
      "PlannedPaymentDate": "2025-08-08",
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-09T02:32:00Z"
    },
    {
      "InvoiceID": "invoice-011-ievyrzc20",
      "InvoiceNumber": "INV-2024-011",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-025-j3x2gappi",
        "Name": "Reliable Industries"
      },
      "Date": "2025-09-01",
      "DueDate": "2025-10-01",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-11-33vndozg3",
          "Description": "Professional Services - Invoice 11",
          "Quantity": 3,
          "UnitAmount": 763,
          "LineAmount": 9929,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 9929,
      "TotalTax": 992,
      "Total": 10921,
      "AmountDue": 0,
      "AmountPaid": 10921,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-09-01",
      "Reference": "Project Y65",
      "BrandingThemeID": "brand-tnwuax0ea",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=oewthzf8a",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-09-01T14:38:00Z"
    },
    {
      "InvoiceID": "invoice-012-nvekpa5do",
      "InvoiceNumber": "INV-2024-012",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-005-m9g4zk5kl",
        "Name": "Trusted Corp"
      },
      "Date": "2025-07-08",
      "DueDate": "2025-08-07",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-12-wnqigpvyy",
          "Description": "Professional Services - Invoice 12",
          "Quantity": 10,
          "UnitAmount": 432,
          "LineAmount": 3894,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 3894,
      "TotalTax": 389,
      "Total": 4283,
      "AmountDue": 4283,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project N4",
      "BrandingThemeID": "brand-8gfvcoxmd",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=7iinfcllp",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-08-07",
      "PlannedPaymentDate": "2025-08-07",
      "HasAttachments": true,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-08T01:58:00Z"
    },
    {
      "InvoiceID": "invoice-013-sykmqtr9e",
      "InvoiceNumber": "INV-2024-013",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-011-xplgz8vf9",
        "Name": "Tech Enterprises"
      },
      "Date": "2025-07-20",
      "DueDate": "2025-08-19",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-13-2g5tj7uix",
          "Description": "Professional Services - Invoice 13",
          "Quantity": 20,
          "UnitAmount": 1081,
          "LineAmount": 4325,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 4325,
      "TotalTax": 432,
      "Total": 4757,
      "AmountDue": 0,
      "AmountPaid": 4757,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-07-20",
      "Reference": "Project Z39",
      "BrandingThemeID": "brand-aws4pcxvx",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=k0amel201",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-20T22:07:00Z"
    },
    {
      "InvoiceID": "invoice-014-l8wdys4r0",
      "InvoiceNumber": "INV-2024-014",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-028-28gclalra",
        "Name": "Dynamic Corp"
      },
      "Date": "2025-07-29",
      "DueDate": "2025-08-28",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-14-wbdu5mazd",
          "Description": "Professional Services - Invoice 14",
          "Quantity": 6,
          "UnitAmount": 674,
          "LineAmount": 1349,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 1349,
      "TotalTax": 134,
      "Total": 1483,
      "AmountDue": 0,
      "AmountPaid": 1483,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-07-29",
      "Reference": "Project I63",
      "BrandingThemeID": "brand-xpxto742c",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=a8l4s0xn4",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-29T16:22:00Z"
    },
    {
      "InvoiceID": "invoice-015-m67iuqo60",
      "InvoiceNumber": "INV-2024-015",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-025-j3x2gappi",
        "Name": "Reliable Industries"
      },
      "Date": "2025-08-01",
      "DueDate": "2025-08-31",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-15-1vo3wnrd8",
          "Description": "Professional Services - Invoice 15",
          "Quantity": 17,
          "UnitAmount": 805,
          "LineAmount": 5637,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 5637,
      "TotalTax": 563,
      "Total": 6200,
      "AmountDue": 0,
      "AmountPaid": 6200,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-01",
      "Reference": "Project H27",
      "BrandingThemeID": "brand-69ctfpyz0",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=zitp42rh3",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": true,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-01T15:34:00Z"
    },
    {
      "InvoiceID": "invoice-016-inzww79qa",
      "InvoiceNumber": "INV-2024-016",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-033-fjy5qh7k9",
        "Name": "Strategic Pty Ltd"
      },
      "Date": "2025-09-18",
      "DueDate": "2025-10-18",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-16-ydgrtbgzi",
          "Description": "Professional Services - Invoice 16",
          "Quantity": 12,
          "UnitAmount": 1168,
          "LineAmount": 7008,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 7008,
      "TotalTax": 700,
      "Total": 7708,
      "AmountDue": 0,
      "AmountPaid": 7708,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-09-18",
      "Reference": "Project U76",
      "BrandingThemeID": "brand-4rvsgzee3",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=4jyg7q3d3",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-09-18T03:24:00Z"
    },
    {
      "InvoiceID": "invoice-017-oguocvcpt",
      "InvoiceNumber": "INV-2024-017",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-022-4ou0psek6",
        "Name": "Innovative Ltd"
      },
      "Date": "2025-09-13",
      "DueDate": "2025-10-13",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-17-tae5oe3dj",
          "Description": "Professional Services - Invoice 17",
          "Quantity": 20,
          "UnitAmount": 693,
          "LineAmount": 7628,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 7628,
      "TotalTax": 762,
      "Total": 8390,
      "AmountDue": 8390,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project X98",
      "BrandingThemeID": "brand-yrywmedi7",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=nmn2qghym",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-10-13",
      "PlannedPaymentDate": "2025-10-13",
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-09-13T07:45:00Z"
    },
    {
      "InvoiceID": "invoice-018-ctod43zhk",
      "InvoiceNumber": "INV-2024-018",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-024-6sigskx2x",
        "Name": "Smart Services"
      },
      "Date": "2025-07-29",
      "DueDate": "2025-08-28",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-18-2av4ajqpt",
          "Description": "Professional Services - Invoice 18",
          "Quantity": 8,
          "UnitAmount": 1057,
          "LineAmount": 4229,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 4229,
      "TotalTax": 422,
      "Total": 4651,
      "AmountDue": 0,
      "AmountPaid": 4651,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-07-29",
      "Reference": "Project A55",
      "BrandingThemeID": "brand-mmt89ohm2",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=zpgvrs731",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-29T00:04:00Z"
    },
    {
      "InvoiceID": "invoice-019-e70jp0nx1",
      "InvoiceNumber": "INV-2024-019",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-025-j3x2gappi",
        "Name": "Reliable Industries"
      },
      "Date": "2025-08-18",
      "DueDate": "2025-09-17",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-19-7h00rgtfq",
          "Description": "Professional Services - Invoice 19",
          "Quantity": 6,
          "UnitAmount": 622,
          "LineAmount": 4978,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 4978,
      "TotalTax": 497,
      "Total": 5475,
      "AmountDue": 0,
      "AmountPaid": 5475,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-18",
      "Reference": "Project R79",
      "BrandingThemeID": "brand-wirpuq4mv",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=qywap9zgc",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-18T22:27:00Z"
    },
    {
      "InvoiceID": "invoice-020-bvaywonz5",
      "InvoiceNumber": "INV-2024-020",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-026-jf5zwtg9m",
        "Name": "Innovative Group"
      },
      "Date": "2025-09-18",
      "DueDate": "2025-10-18",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-20-ofdcflolc",
          "Description": "Professional Services - Invoice 20",
          "Quantity": 3,
          "UnitAmount": 94,
          "LineAmount": 1138,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 1138,
      "TotalTax": 113,
      "Total": 1251,
      "AmountDue": 1251,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project X30",
      "BrandingThemeID": "brand-x0mhwdqfj",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=y97qw4436",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-09-18T14:50:00Z"
    },
    {
      "InvoiceID": "invoice-021-n6pdft1nj",
      "InvoiceNumber": "INV-2024-021",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-030-5u5yn2y3i",
        "Name": "Premier Ltd"
      },
      "Date": "2025-08-10",
      "DueDate": "2025-09-09",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-21-msgqs8stv",
          "Description": "Professional Services - Invoice 21",
          "Quantity": 15,
          "UnitAmount": 2177,
          "LineAmount": 6533,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 6533,
      "TotalTax": 653,
      "Total": 7186,
      "AmountDue": 0,
      "AmountPaid": 7186,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-10",
      "Reference": "Project U67",
      "BrandingThemeID": "brand-vrqhca6x8",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=mml93cppe",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-10T06:40:00Z"
    },
    {
      "InvoiceID": "invoice-022-ez9vr59on",
      "InvoiceNumber": "INV-2024-022",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-030-5u5yn2y3i",
        "Name": "Premier Ltd"
      },
      "Date": "2025-08-15",
      "DueDate": "2025-09-14",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-22-nqe6mm1v5",
          "Description": "Professional Services - Invoice 22",
          "Quantity": 2,
          "UnitAmount": 1470,
          "LineAmount": 8821,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 8821,
      "TotalTax": 882,
      "Total": 9703,
      "AmountDue": 0,
      "AmountPaid": 9703,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-15",
      "Reference": "Project W38",
      "BrandingThemeID": "brand-zj61ulvnm",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=zow11bf9j",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-15T18:46:00Z"
    },
    {
      "InvoiceID": "invoice-023-ar8rd1n3t",
      "InvoiceNumber": "INV-2024-023",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-028-28gclalra",
        "Name": "Dynamic Corp"
      },
      "Date": "2025-08-16",
      "DueDate": "2025-09-15",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-23-okfgh4txu",
          "Description": "Professional Services - Invoice 23",
          "Quantity": 4,
          "UnitAmount": 550,
          "LineAmount": 7713,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 7713,
      "TotalTax": 771,
      "Total": 8484,
      "AmountDue": 0,
      "AmountPaid": 8484,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-16",
      "Reference": "Project X86",
      "BrandingThemeID": "brand-e95urondd",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=fxgg71y6y",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-16T14:21:00Z"
    },
    {
      "InvoiceID": "invoice-024-zjea9lmn5",
      "InvoiceNumber": "INV-2024-024",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-007-hbrt8txme",
        "Name": "Quality Ltd"
      },
      "Date": "2025-07-18",
      "DueDate": "2025-08-17",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-24-2byuxhvmx",
          "Description": "Professional Services - Invoice 24",
          "Quantity": 14,
          "UnitAmount": 329,
          "LineAmount": 6595,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 6595,
      "TotalTax": 659,
      "Total": 7254,
      "AmountDue": 0,
      "AmountPaid": 7254,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-07-18",
      "Reference": "Project C40",
      "BrandingThemeID": "brand-r38uvwdx8",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=ifygrbp98",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-18T11:03:00Z"
    },
    {
      "InvoiceID": "invoice-025-x04qs4qw9",
      "InvoiceNumber": "INV-2024-025",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-021-6bx85x1x7",
        "Name": "Modern Services"
      },
      "Date": "2025-09-04",
      "DueDate": "2025-10-04",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-25-2hmp457vt",
          "Description": "Professional Services - Invoice 25",
          "Quantity": 9,
          "UnitAmount": 508,
          "LineAmount": 5085,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 5085,
      "TotalTax": 508,
      "Total": 5593,
      "AmountDue": 0,
      "AmountPaid": 5593,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-09-04",
      "Reference": "Project W80",
      "BrandingThemeID": "brand-36bqk5ehl",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=9js7n14ni",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": true,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-09-04T17:33:00Z"
    },
    {
      "InvoiceID": "invoice-026-8snfvc19g",
      "InvoiceNumber": "INV-2024-026",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-034-2fdkup11o",
        "Name": "Creative Holdings"
      },
      "Date": "2025-08-22",
      "DueDate": "2025-09-21",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-26-poi4d6tux",
          "Description": "Professional Services - Invoice 26",
          "Quantity": 17,
          "UnitAmount": 381,
          "LineAmount": 5346,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 5346,
      "TotalTax": 534,
      "Total": 5880,
      "AmountDue": 0,
      "AmountPaid": 5880,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-22",
      "Reference": "Project J57",
      "BrandingThemeID": "brand-rotb2x7n6",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=qofl9xk73",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": true,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-22T10:27:00Z"
    },
    {
      "InvoiceID": "invoice-027-hlc2oic9v",
      "InvoiceNumber": "INV-2024-027",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-035-zbrlh7sd1",
        "Name": "Quality Solutions"
      },
      "Date": "2025-08-13",
      "DueDate": "2025-09-12",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-27-1rkjq0hw9",
          "Description": "Professional Services - Invoice 27",
          "Quantity": 14,
          "UnitAmount": 3013,
          "LineAmount": 9039,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 9039,
      "TotalTax": 903,
      "Total": 9942,
      "AmountDue": 0,
      "AmountPaid": 9942,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-13",
      "Reference": "Project T1",
      "BrandingThemeID": "brand-w04epy1qm",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=w2za9qac1",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-13T07:18:00Z"
    },
    {
      "InvoiceID": "invoice-028-wyqwjy13z",
      "InvoiceNumber": "INV-2024-028",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-001-4v6rer9z5",
        "Name": "Advanced Pty Ltd"
      },
      "Date": "2025-08-11",
      "DueDate": "2025-09-10",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-28-w1mmgc0rs",
          "Description": "Professional Services - Invoice 28",
          "Quantity": 13,
          "UnitAmount": 108,
          "LineAmount": 1847,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 1847,
      "TotalTax": 184,
      "Total": 2031,
      "AmountDue": 2031,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project R37",
      "BrandingThemeID": "brand-8uwa4r67x",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=mgdbyvm1r",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-11T07:07:00Z"
    },
    {
      "InvoiceID": "invoice-029-58vv2u3yy",
      "InvoiceNumber": "INV-2024-029",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-035-zbrlh7sd1",
        "Name": "Quality Solutions"
      },
      "Date": "2025-06-27",
      "DueDate": "2025-07-27",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-29-baz25ngr8",
          "Description": "Professional Services - Invoice 29",
          "Quantity": 15,
          "UnitAmount": 630,
          "LineAmount": 5044,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 5044,
      "TotalTax": 504,
      "Total": 5548,
      "AmountDue": 5548,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project M29",
      "BrandingThemeID": "brand-n00afoicz",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=bm8oi3go5",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-07-27",
      "PlannedPaymentDate": "2025-07-27",
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-06-27T15:02:00Z"
    },
    {
      "InvoiceID": "invoice-030-x99ch6ubv",
      "InvoiceNumber": "INV-2024-030",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-006-6cq4am88i",
        "Name": "Innovative Enterprises"
      },
      "Date": "2025-08-26",
      "DueDate": "2025-09-25",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-30-4j31o1t0h",
          "Description": "Professional Services - Invoice 30",
          "Quantity": 18,
          "UnitAmount": 2672,
          "LineAmount": 5344,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 5344,
      "TotalTax": 534,
      "Total": 5878,
      "AmountDue": 0,
      "AmountPaid": 5878,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-26",
      "Reference": "Project X91",
      "BrandingThemeID": "brand-wektssw7r",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=nf3c3steb",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-26T20:19:00Z"
    },
    {
      "InvoiceID": "invoice-031-uc7a0l984",
      "InvoiceNumber": "INV-2024-031",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-030-5u5yn2y3i",
        "Name": "Premier Ltd"
      },
      "Date": "2025-07-12",
      "DueDate": "2025-08-11",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-31-wwmnr0fvy",
          "Description": "Professional Services - Invoice 31",
          "Quantity": 8,
          "UnitAmount": 1110,
          "LineAmount": 8880,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 8880,
      "TotalTax": 888,
      "Total": 9768,
      "AmountDue": 0,
      "AmountPaid": 9768,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-07-12",
      "Reference": "Project L21",
      "BrandingThemeID": "brand-wra0plu1t",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=fm508t1mr",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-12T11:22:00Z"
    },
    {
      "InvoiceID": "invoice-032-afh3k9500",
      "InvoiceNumber": "INV-2024-032",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-024-6sigskx2x",
        "Name": "Smart Services"
      },
      "Date": "2025-08-29",
      "DueDate": "2025-09-28",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-32-gbw9idlg4",
          "Description": "Professional Services - Invoice 32",
          "Quantity": 4,
          "UnitAmount": 510,
          "LineAmount": 9180,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 9180,
      "TotalTax": 918,
      "Total": 10098,
      "AmountDue": 10098,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project R88",
      "BrandingThemeID": "brand-amfom86wv",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=3iwaml34b",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-29T22:37:00Z"
    },
    {
      "InvoiceID": "invoice-033-5iqo5trin",
      "InvoiceNumber": "INV-2024-033",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-025-j3x2gappi",
        "Name": "Reliable Industries"
      },
      "Date": "2025-09-13",
      "DueDate": "2025-10-13",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-33-6wt0s20ky",
          "Description": "Professional Services - Invoice 33",
          "Quantity": 12,
          "UnitAmount": 739,
          "LineAmount": 1478,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 1478,
      "TotalTax": 147,
      "Total": 1625,
      "AmountDue": 0,
      "AmountPaid": 1625,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-09-13",
      "Reference": "Project D20",
      "BrandingThemeID": "brand-9qefuutii",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=0xjsxlq4o",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-09-13T00:30:00Z"
    },
    {
      "InvoiceID": "invoice-034-dlsrhskn4",
      "InvoiceNumber": "INV-2024-034",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-025-j3x2gappi",
        "Name": "Reliable Industries"
      },
      "Date": "2025-08-16",
      "DueDate": "2025-09-15",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-34-8wi699atw",
          "Description": "Professional Services - Invoice 34",
          "Quantity": 20,
          "UnitAmount": 1429,
          "LineAmount": 10005,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 10005,
      "TotalTax": 1000,
      "Total": 11005,
      "AmountDue": 0,
      "AmountPaid": 11005,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-16",
      "Reference": "Project X53",
      "BrandingThemeID": "brand-jjqqv2vlb",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=tfd02kiv5",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": true,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-16T20:58:00Z"
    },
    {
      "InvoiceID": "invoice-035-4qam32ai3",
      "InvoiceNumber": "INV-2024-035",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-026-jf5zwtg9m",
        "Name": "Innovative Group"
      },
      "Date": "2025-09-07",
      "DueDate": "2025-10-07",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-35-u0ythipkm",
          "Description": "Professional Services - Invoice 35",
          "Quantity": 12,
          "UnitAmount": 106,
          "LineAmount": 1166,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 1166,
      "TotalTax": 116,
      "Total": 1282,
      "AmountDue": 1282,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project V17",
      "BrandingThemeID": "brand-lc6vkc30j",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=crxbgsr8m",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-09-07T12:03:00Z"
    },
    {
      "InvoiceID": "invoice-036-wa666m1de",
      "InvoiceNumber": "INV-2024-036",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-034-2fdkup11o",
        "Name": "Creative Holdings"
      },
      "Date": "2025-07-26",
      "DueDate": "2025-08-25",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-36-dguo9u7wp",
          "Description": "Professional Services - Invoice 36",
          "Quantity": 7,
          "UnitAmount": 67,
          "LineAmount": 1140,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 1140,
      "TotalTax": 114,
      "Total": 1254,
      "AmountDue": 0,
      "AmountPaid": 1254,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-07-26",
      "Reference": "Project D7",
      "BrandingThemeID": "brand-bvnw09acr",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=o181i92hi",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-26T22:20:00Z"
    },
    {
      "InvoiceID": "invoice-037-k0q7ehpku",
      "InvoiceNumber": "INV-2024-037",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-012-a0v8xcoef",
        "Name": "Tech Services"
      },
      "Date": "2025-09-05",
      "DueDate": "2025-10-05",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-37-1zlwc20lw",
          "Description": "Professional Services - Invoice 37",
          "Quantity": 1,
          "UnitAmount": 492,
          "LineAmount": 4929,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 4929,
      "TotalTax": 492,
      "Total": 5421,
      "AmountDue": 5421,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project X62",
      "BrandingThemeID": "brand-23zm67cun",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=d9hgbbpkj",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-09-05T21:32:00Z"
    },
    {
      "InvoiceID": "invoice-038-g95ks4igb",
      "InvoiceNumber": "INV-2024-038",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-022-4ou0psek6",
        "Name": "Innovative Ltd"
      },
      "Date": "2025-09-16",
      "DueDate": "2025-10-16",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-38-xsbvam0u7",
          "Description": "Professional Services - Invoice 38",
          "Quantity": 17,
          "UnitAmount": 506,
          "LineAmount": 9621,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 9621,
      "TotalTax": 962,
      "Total": 10583,
      "AmountDue": 10583,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project P89",
      "BrandingThemeID": "brand-ad1z5gna3",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=di91j02p1",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-10-16",
      "PlannedPaymentDate": "2025-10-16",
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-09-16T10:23:00Z"
    },
    {
      "InvoiceID": "invoice-039-yhfq5urij",
      "InvoiceNumber": "INV-2024-039",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-031-42fbag9kv",
        "Name": "Smart Services"
      },
      "Date": "2025-07-13",
      "DueDate": "2025-08-12",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-39-laogtcxwo",
          "Description": "Professional Services - Invoice 39",
          "Quantity": 1,
          "UnitAmount": 1540,
          "LineAmount": 7701,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 7701,
      "TotalTax": 770,
      "Total": 8471,
      "AmountDue": 8471,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project C86",
      "BrandingThemeID": "brand-6vznad9zy",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=cv493ft3q",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-13T11:41:00Z"
    },
    {
      "InvoiceID": "invoice-040-ghcw3cd8o",
      "InvoiceNumber": "INV-2024-040",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-035-zbrlh7sd1",
        "Name": "Quality Solutions"
      },
      "Date": "2025-09-02",
      "DueDate": "2025-10-02",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-40-jtye3hl2f",
          "Description": "Professional Services - Invoice 40",
          "Quantity": 9,
          "UnitAmount": 364,
          "LineAmount": 4011,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 4011,
      "TotalTax": 401,
      "Total": 4412,
      "AmountDue": 0,
      "AmountPaid": 4412,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-09-02",
      "Reference": "Project W97",
      "BrandingThemeID": "brand-6n3jpgkri",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=3p7zw9m50",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-09-02T04:09:00Z"
    },
    {
      "InvoiceID": "invoice-041-78ezdacns",
      "InvoiceNumber": "INV-2024-041",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-009-8i97he5za",
        "Name": "Quality Ltd"
      },
      "Date": "2025-08-24",
      "DueDate": "2025-09-23",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-41-atospizg1",
          "Description": "Professional Services - Invoice 41",
          "Quantity": 10,
          "UnitAmount": 2631,
          "LineAmount": 7893,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 7893,
      "TotalTax": 789,
      "Total": 8682,
      "AmountDue": 8682,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project E12",
      "BrandingThemeID": "brand-hcpg0glht",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=oh57r3cnh",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-24T09:30:00Z"
    },
    {
      "InvoiceID": "invoice-042-2ae75y4yr",
      "InvoiceNumber": "INV-2024-042",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-035-zbrlh7sd1",
        "Name": "Quality Solutions"
      },
      "Date": "2025-06-26",
      "DueDate": "2025-07-26",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-42-m55xstwbe",
          "Description": "Professional Services - Invoice 42",
          "Quantity": 18,
          "UnitAmount": 243,
          "LineAmount": 4629,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 4629,
      "TotalTax": 462,
      "Total": 5091,
      "AmountDue": 5091,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project T75",
      "BrandingThemeID": "brand-omz3vpo63",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=7c211th81",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-07-26",
      "PlannedPaymentDate": "2025-07-26",
      "HasAttachments": true,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-06-26T16:17:00Z"
    },
    {
      "InvoiceID": "invoice-043-wy1ph572b",
      "InvoiceNumber": "INV-2024-043",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-025-j3x2gappi",
        "Name": "Reliable Industries"
      },
      "Date": "2025-08-12",
      "DueDate": "2025-09-11",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-43-qw73h1a79",
          "Description": "Professional Services - Invoice 43",
          "Quantity": 4,
          "UnitAmount": 125,
          "LineAmount": 1503,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 1503,
      "TotalTax": 150,
      "Total": 1653,
      "AmountDue": 0,
      "AmountPaid": 1653,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-12",
      "Reference": "Project A37",
      "BrandingThemeID": "brand-9j0p101b7",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=3c4rfwtkl",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-12T22:47:00Z"
    },
    {
      "InvoiceID": "invoice-044-iwqe9mhw3",
      "InvoiceNumber": "INV-2024-044",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-017-dub5osg65",
        "Name": "Global Corp"
      },
      "Date": "2025-08-04",
      "DueDate": "2025-09-03",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-44-7zf89caxc",
          "Description": "Professional Services - Invoice 44",
          "Quantity": 14,
          "UnitAmount": 177,
          "LineAmount": 2126,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 2126,
      "TotalTax": 212,
      "Total": 2338,
      "AmountDue": 2338,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project V17",
      "BrandingThemeID": "brand-7vegtm617",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=827f892cj",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-09-03",
      "PlannedPaymentDate": "2025-09-03",
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-04T03:01:00Z"
    },
    {
      "InvoiceID": "invoice-045-nkhzxq0ax",
      "InvoiceNumber": "INV-2024-045",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-035-zbrlh7sd1",
        "Name": "Quality Solutions"
      },
      "Date": "2025-08-29",
      "DueDate": "2025-09-28",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-45-blvx2cxy5",
          "Description": "Professional Services - Invoice 45",
          "Quantity": 17,
          "UnitAmount": 561,
          "LineAmount": 3370,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 3370,
      "TotalTax": 337,
      "Total": 3707,
      "AmountDue": 3707,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project F90",
      "BrandingThemeID": "brand-o38ckauss",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=kb2zt638h",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-29T11:31:00Z"
    },
    {
      "InvoiceID": "invoice-046-ygct3ie0l",
      "InvoiceNumber": "INV-2024-046",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-031-42fbag9kv",
        "Name": "Smart Services"
      },
      "Date": "2025-08-11",
      "DueDate": "2025-09-10",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-46-0nb54icmo",
          "Description": "Professional Services - Invoice 46",
          "Quantity": 16,
          "UnitAmount": 260,
          "LineAmount": 4682,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 4682,
      "TotalTax": 468,
      "Total": 5150,
      "AmountDue": 5150,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project M43",
      "BrandingThemeID": "brand-iqlbsbjx6",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=7c7okysfe",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-11T09:02:00Z"
    },
    {
      "InvoiceID": "invoice-047-yg90dvdgg",
      "InvoiceNumber": "INV-2024-047",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-027-9f0hvj9qs",
        "Name": "Creative Pty Ltd"
      },
      "Date": "2025-07-05",
      "DueDate": "2025-08-04",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-47-piuw4ftf8",
          "Description": "Professional Services - Invoice 47",
          "Quantity": 6,
          "UnitAmount": 8264,
          "LineAmount": 8264,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 8264,
      "TotalTax": 826,
      "Total": 9090,
      "AmountDue": 9090,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project W2",
      "BrandingThemeID": "brand-uhxjha787",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=t6m7bulau",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-08-04",
      "PlannedPaymentDate": "2025-08-04",
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-05T02:53:00Z"
    },
    {
      "InvoiceID": "invoice-048-ja8q8nxju",
      "InvoiceNumber": "INV-2024-048",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-006-6cq4am88i",
        "Name": "Innovative Enterprises"
      },
      "Date": "2025-08-01",
      "DueDate": "2025-08-31",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-48-sdhe0ye24",
          "Description": "Professional Services - Invoice 48",
          "Quantity": 16,
          "UnitAmount": 826,
          "LineAmount": 1653,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 1653,
      "TotalTax": 165,
      "Total": 1818,
      "AmountDue": 1818,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project M58",
      "BrandingThemeID": "brand-91mzj1w7i",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=4a6o4tbwk",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-08-31",
      "PlannedPaymentDate": "2025-08-31",
      "HasAttachments": true,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-01T11:42:00Z"
    },
    {
      "InvoiceID": "invoice-049-z2pcohhq4",
      "InvoiceNumber": "INV-2024-049",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-020-2de2lafpr",
        "Name": "Strategic Group"
      },
      "Date": "2025-07-07",
      "DueDate": "2025-08-06",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-49-b8650hklp",
          "Description": "Professional Services - Invoice 49",
          "Quantity": 10,
          "UnitAmount": 138,
          "LineAmount": 1104,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 1104,
      "TotalTax": 110,
      "Total": 1214,
      "AmountDue": 0,
      "AmountPaid": 1214,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-07-07",
      "Reference": "Project Z46",
      "BrandingThemeID": "brand-bdghaeyc9",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=6jzecm3e0",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-07T07:52:00Z"
    },
    {
      "InvoiceID": "invoice-050-lj2803aa1",
      "InvoiceNumber": "INV-2024-050",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-011-xplgz8vf9",
        "Name": "Tech Enterprises"
      },
      "Date": "2025-08-11",
      "DueDate": "2025-09-10",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-50-y65twyv3w",
          "Description": "Professional Services - Invoice 50",
          "Quantity": 4,
          "UnitAmount": 302,
          "LineAmount": 6040,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 6040,
      "TotalTax": 604,
      "Total": 6644,
      "AmountDue": 0,
      "AmountPaid": 6644,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-11",
      "Reference": "Project Y73",
      "BrandingThemeID": "brand-jz4tj636q",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=t3n0cyqbh",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-11T17:51:00Z"
    },
    {
      "InvoiceID": "invoice-051-xy79lmtzl",
      "InvoiceNumber": "INV-2024-051",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-015-ix1l6fsy9",
        "Name": "Reliable Services"
      },
      "Date": "2025-06-24",
      "DueDate": "2025-07-24",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-51-n237z26rz",
          "Description": "Professional Services - Invoice 51",
          "Quantity": 13,
          "UnitAmount": 416,
          "LineAmount": 7504,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 7504,
      "TotalTax": 750,
      "Total": 8254,
      "AmountDue": 0,
      "AmountPaid": 8254,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-06-24",
      "Reference": "Project D96",
      "BrandingThemeID": "brand-29efkw5e7",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=8dpl6wepf",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-06-24T16:32:00Z"
    },
    {
      "InvoiceID": "invoice-052-p8f4f74xl",
      "InvoiceNumber": "INV-2024-052",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-012-a0v8xcoef",
        "Name": "Tech Services"
      },
      "Date": "2025-08-06",
      "DueDate": "2025-09-05",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-52-pvjho14nd",
          "Description": "Professional Services - Invoice 52",
          "Quantity": 1,
          "UnitAmount": 306,
          "LineAmount": 5517,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 5517,
      "TotalTax": 551,
      "Total": 6068,
      "AmountDue": 6068,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project T27",
      "BrandingThemeID": "brand-n595f38z1",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=izb6ozo34",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-09-05",
      "PlannedPaymentDate": "2025-09-05",
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-06T00:46:00Z"
    },
    {
      "InvoiceID": "invoice-053-sjro8pom3",
      "InvoiceNumber": "INV-2024-053",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-003-s0njqtfb2",
        "Name": "Creative Industries"
      },
      "Date": "2025-07-23",
      "DueDate": "2025-08-22",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-53-c2x40p7pb",
          "Description": "Professional Services - Invoice 53",
          "Quantity": 15,
          "UnitAmount": 1078,
          "LineAmount": 8625,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 8625,
      "TotalTax": 862,
      "Total": 9487,
      "AmountDue": 9487,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project J25",
      "BrandingThemeID": "brand-3456j66m6",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=ixdey1449",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-23T13:29:00Z"
    },
    {
      "InvoiceID": "invoice-054-zmhmdt41m",
      "InvoiceNumber": "INV-2024-054",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-028-28gclalra",
        "Name": "Dynamic Corp"
      },
      "Date": "2025-09-07",
      "DueDate": "2025-10-07",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-54-d9y97b7m1",
          "Description": "Professional Services - Invoice 54",
          "Quantity": 15,
          "UnitAmount": 989,
          "LineAmount": 9892,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 9892,
      "TotalTax": 989,
      "Total": 10881,
      "AmountDue": 0,
      "AmountPaid": 10881,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-09-07",
      "Reference": "Project I84",
      "BrandingThemeID": "brand-e3w5s5exh",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=gixjs7jje",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": true,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-09-07T22:18:00Z"
    },
    {
      "InvoiceID": "invoice-055-6dtqbj8tj",
      "InvoiceNumber": "INV-2024-055",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-013-34vim9k4l",
        "Name": "Advanced Corp"
      },
      "Date": "2025-08-25",
      "DueDate": "2025-09-24",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-55-u03lpal05",
          "Description": "Professional Services - Invoice 55",
          "Quantity": 19,
          "UnitAmount": 10316,
          "LineAmount": 10316,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 10316,
      "TotalTax": 1031,
      "Total": 11347,
      "AmountDue": 0,
      "AmountPaid": 11347,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-25",
      "Reference": "Project C90",
      "BrandingThemeID": "brand-f0gfpusug",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=sbubziwmf",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-25T12:53:00Z"
    },
    {
      "InvoiceID": "invoice-056-51kv0yf48",
      "InvoiceNumber": "INV-2024-056",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-006-6cq4am88i",
        "Name": "Innovative Enterprises"
      },
      "Date": "2025-07-22",
      "DueDate": "2025-08-21",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-56-zvbd7s9ml",
          "Description": "Professional Services - Invoice 56",
          "Quantity": 5,
          "UnitAmount": 240,
          "LineAmount": 3128,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 3128,
      "TotalTax": 312,
      "Total": 3440,
      "AmountDue": 0,
      "AmountPaid": 3440,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-07-22",
      "Reference": "Project A36",
      "BrandingThemeID": "brand-s5d5dsdv3",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=wd0nmpfzz",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": true,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-22T19:13:00Z"
    },
    {
      "InvoiceID": "invoice-057-twicurtkz",
      "InvoiceNumber": "INV-2024-057",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-007-hbrt8txme",
        "Name": "Quality Ltd"
      },
      "Date": "2025-08-02",
      "DueDate": "2025-09-01",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-57-f23epxa82",
          "Description": "Professional Services - Invoice 57",
          "Quantity": 8,
          "UnitAmount": 195,
          "LineAmount": 585,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 585,
      "TotalTax": 58,
      "Total": 643,
      "AmountDue": 643,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project C53",
      "BrandingThemeID": "brand-rqnyn7u2b",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=8sbs9w95l",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-09-01",
      "PlannedPaymentDate": "2025-09-01",
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-02T13:26:00Z"
    },
    {
      "InvoiceID": "invoice-058-s741btpv6",
      "InvoiceNumber": "INV-2024-058",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-034-2fdkup11o",
        "Name": "Creative Holdings"
      },
      "Date": "2025-07-04",
      "DueDate": "2025-08-03",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-58-pqy8bqns5",
          "Description": "Professional Services - Invoice 58",
          "Quantity": 14,
          "UnitAmount": 2395,
          "LineAmount": 7187,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 7187,
      "TotalTax": 718,
      "Total": 7905,
      "AmountDue": 0,
      "AmountPaid": 7905,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-07-04",
      "Reference": "Project J23",
      "BrandingThemeID": "brand-8b1vt5eno",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=wry559ct5",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-04T05:27:00Z"
    },
    {
      "InvoiceID": "invoice-059-vyrcmw0ji",
      "InvoiceNumber": "INV-2024-059",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-013-34vim9k4l",
        "Name": "Advanced Corp"
      },
      "Date": "2025-08-05",
      "DueDate": "2025-09-04",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-59-tik7lmip6",
          "Description": "Professional Services - Invoice 59",
          "Quantity": 1,
          "UnitAmount": 518,
          "LineAmount": 9842,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 9842,
      "TotalTax": 984,
      "Total": 10826,
      "AmountDue": 10826,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project C4",
      "BrandingThemeID": "brand-qt5digzlt",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=ew9183vf3",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-09-04",
      "PlannedPaymentDate": "2025-09-04",
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-05T04:07:00Z"
    },
    {
      "InvoiceID": "invoice-060-5xdk41cp7",
      "InvoiceNumber": "INV-2024-060",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-033-fjy5qh7k9",
        "Name": "Strategic Pty Ltd"
      },
      "Date": "2025-08-04",
      "DueDate": "2025-09-03",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-60-wgxd59h0n",
          "Description": "Professional Services - Invoice 60",
          "Quantity": 1,
          "UnitAmount": 203,
          "LineAmount": 3059,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 3059,
      "TotalTax": 305,
      "Total": 3364,
      "AmountDue": 3364,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project R8",
      "BrandingThemeID": "brand-20l0fuykm",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=zx78vys4o",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-04T21:03:00Z"
    },
    {
      "InvoiceID": "invoice-061-9k9hjrnzs",
      "InvoiceNumber": "INV-2024-061",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-008-19ahfsnzk",
        "Name": "Digital Group"
      },
      "Date": "2025-08-16",
      "DueDate": "2025-09-15",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-61-v6lb5615a",
          "Description": "Professional Services - Invoice 61",
          "Quantity": 14,
          "UnitAmount": 161,
          "LineAmount": 2579,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 2579,
      "TotalTax": 257,
      "Total": 2836,
      "AmountDue": 0,
      "AmountPaid": 2836,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-16",
      "Reference": "Project B71",
      "BrandingThemeID": "brand-kqgbjneov",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=8tkyn1cgw",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-16T09:53:00Z"
    },
    {
      "InvoiceID": "invoice-062-2nkdm0pwe",
      "InvoiceNumber": "INV-2024-062",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-029-r1j7alvwk",
        "Name": "Advanced Holdings"
      },
      "Date": "2025-06-30",
      "DueDate": "2025-07-30",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-62-oe94qblkw",
          "Description": "Professional Services - Invoice 62",
          "Quantity": 16,
          "UnitAmount": 83,
          "LineAmount": 1592,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 1592,
      "TotalTax": 159,
      "Total": 1751,
      "AmountDue": 0,
      "AmountPaid": 1751,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-06-30",
      "Reference": "Project I93",
      "BrandingThemeID": "brand-m7wvul2ir",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=orxm0kk8t",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-06-30T13:03:00Z"
    },
    {
      "InvoiceID": "invoice-063-ljgzp0aid",
      "InvoiceNumber": "INV-2024-063",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-027-9f0hvj9qs",
        "Name": "Creative Pty Ltd"
      },
      "Date": "2025-06-28",
      "DueDate": "2025-07-28",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-63-7s6udefk4",
          "Description": "Professional Services - Invoice 63",
          "Quantity": 2,
          "UnitAmount": 1433,
          "LineAmount": 7168,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 7168,
      "TotalTax": 716,
      "Total": 7884,
      "AmountDue": 0,
      "AmountPaid": 7884,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-06-28",
      "Reference": "Project V73",
      "BrandingThemeID": "brand-7h7ez89en",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=rskj7yirq",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-06-28T15:51:00Z"
    },
    {
      "InvoiceID": "invoice-064-xpunos2q0",
      "InvoiceNumber": "INV-2024-064",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-008-19ahfsnzk",
        "Name": "Digital Group"
      },
      "Date": "2025-07-21",
      "DueDate": "2025-08-20",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-64-t2x2g5sun",
          "Description": "Professional Services - Invoice 64",
          "Quantity": 2,
          "UnitAmount": 413,
          "LineAmount": 1652,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 1652,
      "TotalTax": 165,
      "Total": 1817,
      "AmountDue": 0,
      "AmountPaid": 1817,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-07-21",
      "Reference": "Project Y84",
      "BrandingThemeID": "brand-j052k98lr",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=qqbgtoifl",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-21T10:20:00Z"
    },
    {
      "InvoiceID": "invoice-065-y4mtmmejy",
      "InvoiceNumber": "INV-2024-065",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-015-ix1l6fsy9",
        "Name": "Reliable Services"
      },
      "Date": "2025-09-04",
      "DueDate": "2025-10-04",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-65-bj3ak0wb9",
          "Description": "Professional Services - Invoice 65",
          "Quantity": 17,
          "UnitAmount": 2927,
          "LineAmount": 8782,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 8782,
      "TotalTax": 878,
      "Total": 9660,
      "AmountDue": 0,
      "AmountPaid": 9660,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-09-04",
      "Reference": "Project Z69",
      "BrandingThemeID": "brand-5o1wcjcwt",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=hgz6ruk6d",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": true,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-09-04T20:37:00Z"
    },
    {
      "InvoiceID": "invoice-066-l1e8rjd7e",
      "InvoiceNumber": "INV-2024-066",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-035-zbrlh7sd1",
        "Name": "Quality Solutions"
      },
      "Date": "2025-08-16",
      "DueDate": "2025-09-15",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-66-fov8xraqj",
          "Description": "Professional Services - Invoice 66",
          "Quantity": 14,
          "UnitAmount": 123,
          "LineAmount": 1602,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 1602,
      "TotalTax": 160,
      "Total": 1762,
      "AmountDue": 1762,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project I49",
      "BrandingThemeID": "brand-ysag2xfi6",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=ukzleraoe",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-16T16:15:00Z"
    },
    {
      "InvoiceID": "invoice-067-63i2whm3v",
      "InvoiceNumber": "INV-2024-067",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-028-28gclalra",
        "Name": "Dynamic Corp"
      },
      "Date": "2025-08-05",
      "DueDate": "2025-09-04",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-67-cn7h7k2d7",
          "Description": "Professional Services - Invoice 67",
          "Quantity": 6,
          "UnitAmount": 52,
          "LineAmount": 632,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 632,
      "TotalTax": 63,
      "Total": 695,
      "AmountDue": 0,
      "AmountPaid": 695,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-05",
      "Reference": "Project U1",
      "BrandingThemeID": "brand-7kkbt2w0b",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=8yggr7yhj",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-05T17:21:00Z"
    },
    {
      "InvoiceID": "invoice-068-medpxzbtl",
      "InvoiceNumber": "INV-2024-068",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-031-42fbag9kv",
        "Name": "Smart Services"
      },
      "Date": "2025-08-08",
      "DueDate": "2025-09-07",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-68-g70u99snq",
          "Description": "Professional Services - Invoice 68",
          "Quantity": 14,
          "UnitAmount": 91,
          "LineAmount": 1832,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 1832,
      "TotalTax": 183,
      "Total": 2015,
      "AmountDue": 2015,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project Z20",
      "BrandingThemeID": "brand-7t2j8nkl9",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=k9s623t9s",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-08T17:57:00Z"
    },
    {
      "InvoiceID": "invoice-069-zo2w1fot8",
      "InvoiceNumber": "INV-2024-069",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-013-34vim9k4l",
        "Name": "Advanced Corp"
      },
      "Date": "2025-08-27",
      "DueDate": "2025-09-26",
      "Status": "VOIDED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-69-2thsylf8r",
          "Description": "Professional Services - Invoice 69",
          "Quantity": 14,
          "UnitAmount": 2292,
          "LineAmount": 9171,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 9171,
      "TotalTax": 917,
      "Total": 10088,
      "AmountDue": 10088,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project R38",
      "BrandingThemeID": "brand-2u0ivpm5t",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=8uoh2vgsw",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": true,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-27T10:01:00Z"
    },
    {
      "InvoiceID": "invoice-070-7dh73itny",
      "InvoiceNumber": "INV-2024-070",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-018-1svfp1ixh",
        "Name": "Leading Pty Ltd"
      },
      "Date": "2025-07-26",
      "DueDate": "2025-08-25",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-70-kco1lzxcf",
          "Description": "Professional Services - Invoice 70",
          "Quantity": 6,
          "UnitAmount": 264,
          "LineAmount": 5016,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 5016,
      "TotalTax": 501,
      "Total": 5517,
      "AmountDue": 0,
      "AmountPaid": 5517,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-07-26",
      "Reference": "Project G37",
      "BrandingThemeID": "brand-jkhc9yetr",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=s58wwxyu2",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-26T13:20:00Z"
    },
    {
      "InvoiceID": "invoice-071-d6qfvwur4",
      "InvoiceNumber": "INV-2024-071",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-001-4v6rer9z5",
        "Name": "Advanced Pty Ltd"
      },
      "Date": "2025-08-10",
      "DueDate": "2025-09-09",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-71-gncbyjyom",
          "Description": "Professional Services - Invoice 71",
          "Quantity": 12,
          "UnitAmount": 420,
          "LineAmount": 6726,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 6726,
      "TotalTax": 672,
      "Total": 7398,
      "AmountDue": 7398,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project K82",
      "BrandingThemeID": "brand-dnhldvzk6",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=l1d7ouyct",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-09-09",
      "PlannedPaymentDate": "2025-09-09",
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-10T17:17:00Z"
    },
    {
      "InvoiceID": "invoice-072-09lpxi2em",
      "InvoiceNumber": "INV-2024-072",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-018-1svfp1ixh",
        "Name": "Leading Pty Ltd"
      },
      "Date": "2025-09-05",
      "DueDate": "2025-10-05",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-72-cftlefihz",
          "Description": "Professional Services - Invoice 72",
          "Quantity": 6,
          "UnitAmount": 593,
          "LineAmount": 2967,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 2967,
      "TotalTax": 296,
      "Total": 3263,
      "AmountDue": 3263,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project F8",
      "BrandingThemeID": "brand-6nbv1cjoa",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=fst7i85i8",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-10-05",
      "PlannedPaymentDate": "2025-10-05",
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-09-05T19:11:00Z"
    },
    {
      "InvoiceID": "invoice-073-wr0jeaxeh",
      "InvoiceNumber": "INV-2024-073",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-010-bz0xwqtpu",
        "Name": "Trusted Services"
      },
      "Date": "2025-08-26",
      "DueDate": "2025-09-25",
      "Status": "PAID",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-73-1exg6p6ff",
          "Description": "Professional Services - Invoice 73",
          "Quantity": 16,
          "UnitAmount": 160,
          "LineAmount": 2408,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 2408,
      "TotalTax": 240,
      "Total": 2648,
      "AmountDue": 0,
      "AmountPaid": 2648,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": "2025-08-26",
      "Reference": "Project D92",
      "BrandingThemeID": "brand-rg1yoemy3",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=85g4yk4v3",
      "SentToContact": true,
      "ExpectedPaymentDate": null,
      "PlannedPaymentDate": null,
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-08-26T03:56:00Z"
    },
    {
      "InvoiceID": "invoice-074-bt0rubw8s",
      "InvoiceNumber": "INV-2024-074",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-033-fjy5qh7k9",
        "Name": "Strategic Pty Ltd"
      },
      "Date": "2025-06-21",
      "DueDate": "2025-07-21",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-74-1tf28ltp6",
          "Description": "Professional Services - Invoice 74",
          "Quantity": 10,
          "UnitAmount": 1372,
          "LineAmount": 1372,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 1372,
      "TotalTax": 137,
      "Total": 1509,
      "AmountDue": 1509,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project F76",
      "BrandingThemeID": "brand-3ajjgnrrn",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=60ptdoi1w",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-07-21",
      "PlannedPaymentDate": "2025-07-21",
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-06-21T02:54:00Z"
    },
    {
      "InvoiceID": "invoice-075-rk2ddibty",
      "InvoiceNumber": "INV-2024-075",
      "Type": "ACCREC",
      "Contact": {
        "ContactID": "contact-006-6cq4am88i",
        "Name": "Innovative Enterprises"
      },
      "Date": "2025-07-09",
      "DueDate": "2025-08-08",
      "Status": "AUTHORISED",
      "LineAmountTypes": "Exclusive",
      "LineItems": [
        {
          "LineItemID": "line-75-igk0osmm3",
          "Description": "Professional Services - Invoice 75",
          "Quantity": 14,
          "UnitAmount": 369,
          "LineAmount": 3691,
          "AccountCode": "200",
          "TaxType": "GST on Income"
        }
      ],
      "SubTotal": 3691,
      "TotalTax": 369,
      "Total": 4060,
      "AmountDue": 4060,
      "AmountPaid": 0,
      "AmountCredited": 0,
      "CurrencyRate": 1,
      "CurrencyCode": "AUD",
      "FullyPaidOnDate": null,
      "Reference": "Project B79",
      "BrandingThemeID": "brand-1z136s3kz",
      "Url": "https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=mmra155g2",
      "SentToContact": true,
      "ExpectedPaymentDate": "2025-08-08",
      "PlannedPaymentDate": "2025-08-08",
      "HasAttachments": false,
      "IsDiscounted": false,
      "HasErrors": false,
      "InvoiceType": "ACCREC",
      "UpdatedDateUTC": "2025-07-09T02:02:00Z"
    }
  ],
  "items": [
    {
      "ItemID": "item-001-rxdz8bp4o",
      "Code": "ITEM001",
      "Name": "Marketing Package 1",
      "Description": "Professional marketing package service",
      "PurchaseDescription": "Purchase of marketing package",
      "SalesDetails": {
        "UnitPrice": 216,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 172,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 977,
      "QuantityOnHand": 57,
      "UpdatedDateUTC": "2024-03-15T00:00:00Z"
    },
    {
      "ItemID": "item-002-pvlmhq8h2",
      "Code": "ITEM002",
      "Name": "Maintenance Contract 2",
      "Description": "Professional maintenance contract service",
      "PurchaseDescription": "Purchase of maintenance contract",
      "SalesDetails": {
        "UnitPrice": 424,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 339,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 1715,
      "QuantityOnHand": 8,
      "UpdatedDateUTC": "2024-10-15T00:00:00Z"
    },
    {
      "ItemID": "item-003-fp9n37h9w",
      "Code": "ITEM003",
      "Name": "Consulting Hours 3",
      "Description": "Professional consulting hours service",
      "PurchaseDescription": "Purchase of consulting hours",
      "SalesDetails": {
        "UnitPrice": 284,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 227,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 2083,
      "QuantityOnHand": 34,
      "UpdatedDateUTC": "2024-02-15T00:00:00Z"
    },
    {
      "ItemID": "item-004-lbdwmq6vd",
      "Code": "ITEM004",
      "Name": "Design Services 4",
      "Description": "Professional design services service",
      "PurchaseDescription": "Purchase of design services",
      "SalesDetails": {
        "UnitPrice": 316,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 252,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 909,
      "QuantityOnHand": 91,
      "UpdatedDateUTC": "2024-09-15T00:00:00Z"
    },
    {
      "ItemID": "item-005-nos9qbklg",
      "Code": "ITEM005",
      "Name": "Installation Service 5",
      "Description": "Professional installation service service",
      "PurchaseDescription": "Purchase of installation service",
      "SalesDetails": {
        "UnitPrice": 313,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 250,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 2626,
      "QuantityOnHand": 54,
      "UpdatedDateUTC": "2024-09-15T00:00:00Z"
    },
    {
      "ItemID": "item-006-fppfmnzow",
      "Code": "ITEM006",
      "Name": "Design Services 6",
      "Description": "Professional design services service",
      "PurchaseDescription": "Purchase of design services",
      "SalesDetails": {
        "UnitPrice": 281,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 224,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 1088,
      "QuantityOnHand": 33,
      "UpdatedDateUTC": "2024-08-15T00:00:00Z"
    },
    {
      "ItemID": "item-007-l8ges27s2",
      "Code": "ITEM007",
      "Name": "Maintenance Contract 7",
      "Description": "Professional maintenance contract service",
      "PurchaseDescription": "Purchase of maintenance contract",
      "SalesDetails": {
        "UnitPrice": 357,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 285,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 2188,
      "QuantityOnHand": 14,
      "UpdatedDateUTC": "2024-04-15T00:00:00Z"
    },
    {
      "ItemID": "item-008-1ihbj6i14",
      "Code": "ITEM008",
      "Name": "Installation Service 8",
      "Description": "Professional installation service service",
      "PurchaseDescription": "Purchase of installation service",
      "SalesDetails": {
        "UnitPrice": 337,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 269,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 2698,
      "QuantityOnHand": 5,
      "UpdatedDateUTC": "2024-09-15T00:00:00Z"
    },
    {
      "ItemID": "item-009-55gppkaag",
      "Code": "ITEM009",
      "Name": "Support Package 9",
      "Description": "Professional support package service",
      "PurchaseDescription": "Purchase of support package",
      "SalesDetails": {
        "UnitPrice": 284,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 227,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 1430,
      "QuantityOnHand": 99,
      "UpdatedDateUTC": "2024-07-15T00:00:00Z"
    },
    {
      "ItemID": "item-010-vs5ip5kal",
      "Code": "ITEM010",
      "Name": "Software License 10",
      "Description": "Professional software license service",
      "PurchaseDescription": "Purchase of software license",
      "SalesDetails": {
        "UnitPrice": 475,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 380,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 3369,
      "QuantityOnHand": 63,
      "UpdatedDateUTC": "2024-05-15T00:00:00Z"
    },
    {
      "ItemID": "item-011-smdyteley",
      "Code": "ITEM011",
      "Name": "Marketing Package 11",
      "Description": "Professional marketing package service",
      "PurchaseDescription": "Purchase of marketing package",
      "SalesDetails": {
        "UnitPrice": 173,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 138,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 1356,
      "QuantityOnHand": 51,
      "UpdatedDateUTC": "2024-08-15T00:00:00Z"
    },
    {
      "ItemID": "item-012-j1q4v9801",
      "Code": "ITEM012",
      "Name": "Development Work 12",
      "Description": "Professional development work service",
      "PurchaseDescription": "Purchase of development work",
      "SalesDetails": {
        "UnitPrice": 271,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 216,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 2451,
      "QuantityOnHand": 80,
      "UpdatedDateUTC": "2024-02-15T00:00:00Z"
    },
    {
      "ItemID": "item-013-i99ugfqco",
      "Code": "ITEM013",
      "Name": "Support Package 13",
      "Description": "Professional support package service",
      "PurchaseDescription": "Purchase of support package",
      "SalesDetails": {
        "UnitPrice": 206,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 164,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 419,
      "QuantityOnHand": 54,
      "UpdatedDateUTC": "2024-09-15T00:00:00Z"
    },
    {
      "ItemID": "item-014-tmv9fph8d",
      "Code": "ITEM014",
      "Name": "Training Session 14",
      "Description": "Professional training session service",
      "PurchaseDescription": "Purchase of training session",
      "SalesDetails": {
        "UnitPrice": 193,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 154,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 743,
      "QuantityOnHand": 60,
      "UpdatedDateUTC": "2024-10-15T00:00:00Z"
    },
    {
      "ItemID": "item-015-aws09v39r",
      "Code": "ITEM015",
      "Name": "Maintenance Contract 15",
      "Description": "Professional maintenance contract service",
      "PurchaseDescription": "Purchase of maintenance contract",
      "SalesDetails": {
        "UnitPrice": 162,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 129,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 1617,
      "QuantityOnHand": 89,
      "UpdatedDateUTC": "2024-03-15T00:00:00Z"
    },
    {
      "ItemID": "item-016-kq8c7s5k5",
      "Code": "ITEM016",
      "Name": "Technical Support 16",
      "Description": "Professional technical support service",
      "PurchaseDescription": "Purchase of technical support",
      "SalesDetails": {
        "UnitPrice": 197,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 157,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 311,
      "QuantityOnHand": 73,
      "UpdatedDateUTC": "2024-11-15T00:00:00Z"
    },
    {
      "ItemID": "item-017-h82r7640a",
      "Code": "ITEM017",
      "Name": "Marketing Package 17",
      "Description": "Professional marketing package service",
      "PurchaseDescription": "Purchase of marketing package",
      "SalesDetails": {
        "UnitPrice": 446,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 356,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 560,
      "QuantityOnHand": 40,
      "UpdatedDateUTC": "2024-04-15T00:00:00Z"
    },
    {
      "ItemID": "item-018-etzmj65bp",
      "Code": "ITEM018",
      "Name": "Installation Service 18",
      "Description": "Professional installation service service",
      "PurchaseDescription": "Purchase of installation service",
      "SalesDetails": {
        "UnitPrice": 231,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 184,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 94,
      "QuantityOnHand": 88,
      "UpdatedDateUTC": "2024-04-15T00:00:00Z"
    },
    {
      "ItemID": "item-019-ghz3n4wbm",
      "Code": "ITEM019",
      "Name": "Marketing Package 19",
      "Description": "Professional marketing package service",
      "PurchaseDescription": "Purchase of marketing package",
      "SalesDetails": {
        "UnitPrice": 498,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 398,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 3523,
      "QuantityOnHand": 35,
      "UpdatedDateUTC": "2024-12-15T00:00:00Z"
    },
    {
      "ItemID": "item-020-nxobqluo1",
      "Code": "ITEM020",
      "Name": "Training Session 20",
      "Description": "Professional training session service",
      "PurchaseDescription": "Purchase of training session",
      "SalesDetails": {
        "UnitPrice": 332,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 265,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 272,
      "QuantityOnHand": 95,
      "UpdatedDateUTC": "2024-01-15T00:00:00Z"
    },
    {
      "ItemID": "item-021-nwtra5aa6",
      "Code": "ITEM021",
      "Name": "Maintenance Contract 21",
      "Description": "Professional maintenance contract service",
      "PurchaseDescription": "Purchase of maintenance contract",
      "SalesDetails": {
        "UnitPrice": 535,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 428,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 1246,
      "QuantityOnHand": 86,
      "UpdatedDateUTC": "2024-11-15T00:00:00Z"
    },
    {
      "ItemID": "item-022-9cuujgikg",
      "Code": "ITEM022",
      "Name": "Design Services 22",
      "Description": "Professional design services service",
      "PurchaseDescription": "Purchase of design services",
      "SalesDetails": {
        "UnitPrice": 259,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 207,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 510,
      "QuantityOnHand": 4,
      "UpdatedDateUTC": "2024-01-15T00:00:00Z"
    },
    {
      "ItemID": "item-023-neg1re3iv",
      "Code": "ITEM023",
      "Name": "Software License 23",
      "Description": "Professional software license service",
      "PurchaseDescription": "Purchase of software license",
      "SalesDetails": {
        "UnitPrice": 82,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 65,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 226,
      "QuantityOnHand": 99,
      "UpdatedDateUTC": "2024-04-15T00:00:00Z"
    },
    {
      "ItemID": "item-024-aye5jkskx",
      "Code": "ITEM024",
      "Name": "Training Session 24",
      "Description": "Professional training session service",
      "PurchaseDescription": "Purchase of training session",
      "SalesDetails": {
        "UnitPrice": 184,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 147,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 1080,
      "QuantityOnHand": 48,
      "UpdatedDateUTC": "2024-05-15T00:00:00Z"
    },
    {
      "ItemID": "item-025-df9q1rk5j",
      "Code": "ITEM025",
      "Name": "Software License 25",
      "Description": "Professional software license service",
      "PurchaseDescription": "Purchase of software license",
      "SalesDetails": {
        "UnitPrice": 198,
        "AccountCode": "200",
        "TaxType": "GST on Income",
        "IsSold": true,
        "IsPurchased": false
      },
      "PurchaseDetails": {
        "UnitPrice": 158,
        "AccountCode": "400",
        "TaxType": "GST on Expenses",
        "IsSold": false,
        "IsPurchased": true
      },
      "IsTrackedAsInventory": false,
      "IsSold": true,
      "IsPurchased": true,
      "InventoryAssetAccountCode": "620",
      "TotalCostPool": 473,
      "QuantityOnHand": 24,
      "UpdatedDateUTC": "2024-11-15T00:00:00Z"
    }
  ],
  "bank-transactions": [],
  "tax-rates": [],
  "receipts": [],
  "purchase-orders": [],
  "quotes": [],
  "tracking-categories": [],
  "credit-notes": [],
  "manual-journals": [],
  "prepayments": [],
  "overpayments": [],
  "reports": []
};

// Demo endpoint to show sample data
const getDemoData = async (req, res) => {
  try {
    const { dataType } = req.params;
    
    // Handle special case for all-basic-data
    if (dataType === 'all-basic-data') {
      const basicData = {
        organization: sampleXeroData.organization,
        contacts: sampleXeroData.contacts,
        accounts: sampleXeroData.accounts,
        invoices: sampleXeroData.invoices
      };
      
      return res.json({
        success: true,
        message: 'Demo all-basic-data retrieved successfully',
        data: basicData,
        meta: {
          tenantId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
          dataType: 'all-basic-data',
          count: Object.keys(basicData).length,
          isDemoData: true,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    if (!sampleXeroData[dataType]) {
      return res.status(400).json({
        success: false,
        message: `Demo data not available for: ${dataType}`,
        availableTypes: Object.keys(sampleXeroData)
      });
    }

    const data = sampleXeroData[dataType];
    
    res.json({
      success: true,
      message: `Demo ${dataType} data retrieved successfully`,
      data: data,
      meta: {
        tenantId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        dataType: dataType,
        count: Array.isArray(data) ? data.length : 1,
        isDemoData: true,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Demo data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve demo data',
      error: error.message
    });
  }
};

module.exports = {
  getDemoData
};
