import type React from 'react';

export interface NavItemType {
  name: string;
  icon: React.ElementType;
  active?: boolean;
  special?: boolean;
}

export interface StatCardType {
  title: string;
  value: string;
  icon: React.ElementType;
  percentage?: number;
  trend: 'up' | 'down';
  iconBgColor: string;
}

export interface SystemAlertType {
  title: string;
  description: string;
  time: string;
  type: 'alert' | 'success';
}

export interface RecentSessionType {
  clientName: string;
  name: string;
  avatarUrl: string;
  id: string;
  description: string;
  patientId: string;
  therapistName: string;
  therapistId: string;
}
export interface RecentSessionType2 {

  name: string;
  avatarUrl: string;
  description: string;

}
