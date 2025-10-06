#!/bin/bash

# Cloudflare DNS Management Script
# Automatically creates/updates DNS records for greeventech.com

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env.production ]; then
    export $(grep -v '^#' .env.production | xargs)
fi

# Cloudflare API credentials
API_TOKEN="${CLOUDFLARE_API_TOKEN}"
ZONE_ID="${CLOUDFLARE_ZONE_ID}"
VPS_IP="${VPS_IP:-217.196.48.47}"

# Domains to configure
DOMAINS=(
    "greeventech.com"
    "www.greeventech.com"
    "analytics.greeventech.com"
    "posthog.greeventech.com"
)

echo -e "${GREEN}🌐 Cloudflare DNS Management${NC}"
echo "=================================="
echo ""

# Verify API token
echo -e "${YELLOW}→${NC} Verifying Cloudflare API access..."
VERIFY=$(curl -s "https://api.cloudflare.com/client/v4/user/tokens/verify" \
    -H "Authorization: Bearer $API_TOKEN")

if echo "$VERIFY" | grep -q '"success":true'; then
    echo -e "${GREEN}✓${NC} API token verified"
else
    echo -e "${RED}✗${NC} API token verification failed"
    exit 1
fi

# Function to get DNS record ID
get_record_id() {
    local domain=$1
    curl -s "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=$domain" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" | \
        jq -r '.result[0].id // empty'
}

# Function to get record type
get_record_type() {
    local domain=$1
    curl -s "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=$domain" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" | \
        jq -r '.result[0].type // empty'
}

# Function to delete DNS record
delete_record() {
    local record_id=$1
    local domain=$2
    curl -s -X DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$record_id" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" > /dev/null
    echo -e "${YELLOW}  Deleted old record for $domain${NC}"
}

# Function to create A record
create_a_record() {
    local domain=$1
    local response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" \
        --data "{\"type\":\"A\",\"name\":\"$domain\",\"content\":\"$VPS_IP\",\"ttl\":1,\"proxied\":true}")

    if echo "$response" | grep -q '"success":true'; then
        echo -e "${GREEN}✓${NC} Created A record: $domain → $VPS_IP (Proxied)"
    else
        echo -e "${RED}✗${NC} Failed to create A record for $domain"
        echo "$response" | jq '.errors'
    fi
}

# Function to update A record
update_a_record() {
    local record_id=$1
    local domain=$2
    local response=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$record_id" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" \
        --data "{\"type\":\"A\",\"name\":\"$domain\",\"content\":\"$VPS_IP\",\"ttl\":1,\"proxied\":true}")

    if echo "$response" | grep -q '"success":true'; then
        echo -e "${GREEN}✓${NC} Updated A record: $domain → $VPS_IP (Proxied)"
    else
        echo -e "${RED}✗${NC} Failed to update A record for $domain"
    fi
}

echo ""
echo -e "${YELLOW}→${NC} Configuring DNS records for VPS IP: $VPS_IP"
echo ""

# Process each domain
for domain in "${DOMAINS[@]}"; do
    echo -e "${YELLOW}→${NC} Processing: $domain"

    # Check if record exists
    RECORD_ID=$(get_record_id "$domain")
    RECORD_TYPE=$(get_record_type "$domain")

    if [ -n "$RECORD_ID" ]; then
        # Record exists
        if [ "$RECORD_TYPE" = "A" ]; then
            # Update existing A record
            update_a_record "$RECORD_ID" "$domain"
        else
            # Delete non-A record (e.g., CNAME) and create A record
            echo -e "${YELLOW}  Found $RECORD_TYPE record, replacing with A record${NC}"
            delete_record "$RECORD_ID" "$domain"
            sleep 1
            create_a_record "$domain"
        fi
    else
        # Record doesn't exist, create it
        create_a_record "$domain"
    fi

    echo ""
done

echo -e "${GREEN}✓${NC} DNS configuration complete!"
echo ""
echo -e "${YELLOW}→${NC} Waiting 30 seconds for DNS propagation..."
sleep 30

echo ""
echo -e "${GREEN}✓${NC} DNS records updated successfully!"
echo ""
echo "Your domains now point to: $VPS_IP"
echo ""
echo "DNS Records:"
for domain in "${DOMAINS[@]}"; do
    echo "  • https://$domain"
done
echo ""
