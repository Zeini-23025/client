import React from 'react';
import TableList from './Common/TableList';
import { apiServices } from '../../../api';

const ImmobilierList = () => {
  const columns = [
    { field: 'nom', header: 'Nom' },
    { field: 'adresse', header: 'Adresse' },
    { field: 'superficie', header: 'Superficie' },
    { field: 'montant', header: 'Montant' },
    { field: 'type', header: 'Type' },
    { field: 'proprietaire', header: 'Propriétaire' },
    { field: 'created_at', header: 'Date création' },
    { field: 'updated_at', header: 'Dernière modification' }
  ];

  const transformData = (item, field) => {
    switch (field) {
      case 'montant':
        return `${item[field]} MRU`;
      case 'superficie':
        return `${item[field]} m²`;
      case 'created_at':
      case 'updated_at':
        return new Date(item[field]).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      case 'type':
        return item[field] || 'Non spécifié';
      case 'proprietaire':
        return item[field] || 'Non spécifié';
      default:
        return item[field];
    }
  };

  return (
    <TableList
      title="Immobiliers"
      endpoint="immobiliers"
      columns={columns}
      dataKey="immobiliers"
      searchFields={['nom', 'adresse', 'type', 'proprietaire']}
      createPath="/dashboard/gestion-des-tables/immobilier/create"
      viewPath="/dashboard/gestion-des-tables/immobilier"
      transformData={transformData}
    />
  );
};

export default ImmobilierList; 