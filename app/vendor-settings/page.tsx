import VendorSettingsScreen from '@/components/VendorSettingsScreen';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - StreetEats Vendor',
};

export default function VendorSettings() {
  return <VendorSettingsScreen />;
}
