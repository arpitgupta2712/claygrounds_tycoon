// Custom mapping from API state names to GeoJSON state_name values
// Add more mappings as needed for edge cases
const STATE_NAME_MAP = {
  'Delhi': 'Delhi',
  'NCT of Delhi': 'Delhi',
  'Haryana': 'Haryana',
  'West Bengal': 'West Bengal',
  'Uttar Pradesh': 'Uttar Pradesh',
  'Maharashtra': 'Maharashtra',
  'Karnataka': 'Karnataka',
  'Tamil Nadu': 'Tamil Nadu',
  'Telangana': 'Telangana',
  'Andhra Pradesh': 'Andhra Pradesh',
  'Punjab': 'Punjab',
  'Gujarat': 'Gujarat',
  'Rajasthan': 'Rajasthan',
  'Madhya Pradesh': 'Madhya Pradesh',
  'Bihar': 'Bihar',
  'Odisha': 'Odisha',
  'Kerala': 'Kerala',
  'Assam': 'Assam',
  'Chhattisgarh': 'Chhattisgarh',
  'Jharkhand': 'Jharkhand',
  'Goa': 'Goa',
  'Tripura': 'Tripura',
  'Manipur': 'Manipur',
  'Himachal Pradesh': 'Himachal Pradesh',
  'Uttarakhand': 'Uttarakhand',
  'Jammu and Kashmir': 'Jammu & Kashmir',
  'Jammu & Kashmir': 'Jammu & Kashmir',
  'Ladakh': 'Ladakh',
  'Puducherry': 'Puducherry',
  'Chandigarh': 'Chandigarh',
  'Meghalaya': 'Meghalaya',
  'Nagaland': 'Nagaland',
  'Sikkim': 'Sikkim',
  'Mizoram': 'Mizoram',
  'Arunachal Pradesh': 'Arunachal Pradesh',
  'Andaman and Nicobar Islands': 'Andaman & Nicobar Island',
  'Andaman & Nicobar Islands': 'Andaman & Nicobar Island',
  'Dadra and Nagar Haveli and Daman and Diu': 'Dadra and Nagar Haveli',
  'Dadra & Nagar Haveli and Daman & Diu': 'Dadra and Nagar Haveli',
  'Lakshadweep': 'Lakshadweep',
};

export function mapApiStateToGeoJson(apiState) {
  if (!apiState) return null;
  // Try direct match, then case-insensitive, then fallback
  return (
    STATE_NAME_MAP[apiState] ||
    STATE_NAME_MAP[apiState.trim()] ||
    STATE_NAME_MAP[apiState.trim().toLowerCase()] ||
    apiState
  );
}

export default STATE_NAME_MAP; 