import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import VirtualizedTable from './VirtualizedTable';
import { GetPromotionsResponse, Promotion } from '../api/types/promotionType';
import createPromotionsInfiniteQueryOptions from '../createPromotionsInfiniteQueryOptions';
import { useWebSocketTableUpdates } from '../hooks/useWebSocketTableUpdates';
import { createPromotion, updatePromotion, deletePromotion } from '../api/promotion';
import PromotionForm from './PromotionForm';
import Modal from './Modal';
import DeleteConfirmation from './DeleteConfirmation';
import './PromotionsTable.css';

const queryClient = new QueryClient()

function PromotionsTableWithWebSocket() {
  useWebSocketTableUpdates();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (promotionData: Omit<Promotion, 'id'>) => {
    try {
      setFormLoading(true);
      setError(null);
      await createPromotion(promotionData);
      setIsCreateModalOpen(false);
      // Invalidate and refetch the promotions query
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    } catch (err) {
      setError('Failed to create promotion');
      console.error('Error creating promotion:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (promotionData: Omit<Promotion, 'id'>) => {
    if (!selectedPromotion) return;
    
    try {
      setFormLoading(true);
      setError(null);
      await updatePromotion(selectedPromotion.id, promotionData);
      setIsEditModalOpen(false);
      setSelectedPromotion(null);
      // Invalidate and refetch the promotions query
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    } catch (err) {
      setError('Failed to update promotion');
      console.error('Error updating promotion:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPromotion) return;
    
    try {
      setDeleteLoading(true);
      setError(null);
      await deletePromotion(selectedPromotion.id);
      setIsDeleteModalOpen(false);
      setSelectedPromotion(null);
      // Invalidate and refetch the promotions query
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    } catch (err) {
      setError('Failed to delete promotion');
      console.error('Error deleting promotion:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="promotions-container">

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      <div className="promotions-header">

      <h1 style={{ textAlign: 'center' }}>Promotions</h1>
      <button 
          className="btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
          >
          Create New Promotion
        </button>
      </div>

      <div >
        <VirtualizedTable<Promotion, GetPromotionsResponse>
          queryOptions={createPromotionsInfiniteQueryOptions()}
          dataExtractor={(response) => response.promotions}
          headers={['Promotion Name', 'Type', 'Start Date', 'End Date', 'User Group Name', 'Actions']}
          renderItem={(promotion, _) => (
            <>
              <td>{promotion.promotionName}</td>
              <td>
                <span className={`type-badge type-${promotion.type}`}>
                  {promotion.type}
                </span>
              </td>
              <td>{formatDate(promotion.startDate)}</td>
              <td>{formatDate(promotion.endDate)}</td>
              <td>{promotion.userGroupName}</td>
              <td className="actions">
                <button
                  className="btn-edit"
                  onClick={() => openEditModal(promotion)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="btn-delete"
                  onClick={() => openDeleteModal(promotion)}
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </>
          )}
        />
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <PromotionForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={formLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPromotion(null);
        }}
      >
        <PromotionForm
          promotion={selectedPromotion || undefined}
          onSubmit={handleUpdate}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedPromotion(null);
          }}
          isLoading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPromotion(null);
        }}
        onConfirm={handleDelete}
        promotionName={selectedPromotion?.promotionName || ''}
        isLoading={deleteLoading}
      />
    </div>
  );
}

export default function PromotionsVirtualizedTable() {
  return (
    <QueryClientProvider client={queryClient}>
      <PromotionsTableWithWebSocket />
    </QueryClientProvider>
  );
} 