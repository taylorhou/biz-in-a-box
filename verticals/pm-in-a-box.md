# pm-in-a-box

Property management vertical of biz-in-a-box.

**Maintainer:** @taylorhou  
**Repo:** https://github.com/taylorhou/pm-in-a-box *(coming soon)*  
**Status:** in development  

## Key difference from base

In property management, the base entity is not a business — it's a **rental unit**.  
A multifamily apartment is a folder of unit journals.  
An investor LLC is a folder of property folders.  
The PM company has its own separate `biz-in-a-box` journal, but is granted access to write to the unit journals it manages.

## Entity type

```yaml
type: rental-unit
meta:
  unit: "101"
  property: "123 Main St"
  bedrooms: 2
  sqft: 950
```

## Labels added

`lease`, `vacancy`, `rent`, `late-fee`, `security-deposit`, `maintenance`,  
`inspection`, `violation`, `renewal`, `eviction`, `notice`, `capex`,  
`mortgage`, `insurance`, `tax`, `mgmt-fee`, `distribution`, `utility`

## Accounts added

```yaml
revenue:
  4100-rent:            "Rent income"
  4110-late-fee:        "Late fees"
  4120-pet-fee:         "Pet fees"
  4130-parking:         "Parking income"
  4190-other-income:    "Other rental income"

expenses:
  5100-maintenance:     "Repairs and maintenance"
  5110-capex:           "Capital expenditures"
  5200-mgmt-fee:        "Property management fees"
  5300-mortgage:        "Mortgage principal and interest"
  5310-insurance:       "Property insurance"
  5320-taxes:           "Property taxes"
  5330-utilities:       "Utilities (owner-paid)"
  5340-hoa:             "HOA dues"
  5400-vacancy-cost:    "Vacancy and turnover costs"
```
