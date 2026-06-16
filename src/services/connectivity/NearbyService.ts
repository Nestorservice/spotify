import { PermissionsAndroid, Platform } from 'react-native';

export interface NearbyParticipant {
  id: string;
  name: string;
  avatar: string;
}

export interface PartySession {
  id: string;
  hostId: string;
  name: string;
  participants: NearbyParticipant[];
}

class NearbyService {
  async requestPermissions() {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return result['android.permission.ACCESS_FINE_LOCATION'] === 'granted';
    }
    return true;
  }

  // Placeholder for discovery logic
  async startDiscovery(onSessionFound: (session: PartySession) => void) {
    console.log('Starting discovery...');
    // Real implementation would use Google Nearby Connections
  }

  async stopDiscovery() {
    console.log('Stopping discovery...');
  }

  async createSession(name: string): Promise<PartySession> {
    console.log('Creating session:', name);
    // Real implementation would start advertising
    return {
      id: Math.random().toString(36).substr(2, 9),
      hostId: 'current-user-id',
      name,
      participants: [],
    };
  }

  async joinSession(sessionId: string) {
    console.log('Joining session:', sessionId);
  }
}

export const nearbyService = new NearbyService();
