import React from 'react';
import type { PrimaryRole } from '@/types';
import { IndividualHome } from './IndividualHome';
import { FreelancerHome } from './FreelancerHome';
import { EntrepreneurHome } from './EntrepreneurHome';
import { SMEHome } from './SMEHome';

export interface RoleHomeProps {
  name: string;
  primaryRole: PrimaryRole;
  femaleFounder?: boolean;
}

/**
 * Role-aware Home dispatcher (docs 02 §5, 11 §3). Never shows a generic
 * dashboard — each persona renders its own shell with its own metrics.
 */
export function RoleHome({ name, primaryRole, femaleFounder = false }: RoleHomeProps) {
  switch (primaryRole) {
    case 'freelancer':
      return <FreelancerHome name={name} />;
    case 'entrepreneur':
      return <EntrepreneurHome name={name} femaleFounder={femaleFounder} />;
    case 'sme':
      return <SMEHome name={name} />;
    case 'individual':
    default:
      return <IndividualHome name={name} />;
  }
}