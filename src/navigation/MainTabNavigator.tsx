import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CalendarScreen } from '@/features/calendar/CalendarScreen';
import { CaseListScreen } from '@/features/cases/CaseListScreen';
import { DashboardScreen } from '@/features/dashboard/DashboardScreen';
import { GuidanceScreen } from '@/features/guidance/GuidanceScreen';
import { SettingsScreen } from '@/features/settings/SettingsScreen';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Cases" component={CaseListScreen} options={{ title: 'Cases' }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendar' }} />
      <Tab.Screen name="Guidance" component={GuidanceScreen} options={{ title: 'Guidance' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}
