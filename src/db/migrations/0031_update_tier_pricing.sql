-- Update market_contract_instances to new tier capital ranges
-- Controlled: $100 – $1,500
-- Elevated:   $250 – $3,000
-- Maximum:    $500 – $5,000

UPDATE market_contract_instances
SET min_lock_cents = 10000, max_lock_cents = 150000
WHERE tier = 'controlled';

UPDATE market_contract_instances
SET min_lock_cents = 25000, max_lock_cents = 300000
WHERE tier = 'elevated';

UPDATE market_contract_instances
SET min_lock_cents = 50000, max_lock_cents = 500000
WHERE tier = 'maximum';
