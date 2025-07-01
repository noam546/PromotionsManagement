import React, { useState, useEffect } from 'react';
import { Promotion } from '../api/types/promotionType';
import { getPromotions, createPromotion, updatePromotion, deletePromotion } from '../api/promotion';
import PromotionForm from './PromotionForm';
import Modal from './Modal';
import DeleteConfirmation from './DeleteConfirmation';
import './PromotionsTable.css';

const PromotionsTable = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getPromotions();
            setPromotions(response.promotions);
        } catch (err) {
            setError('Failed to fetch promotions');
            console.error('Error fetching promotions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleCreate = async (promotionData: Omit<Promotion, 'id'>) => {
        try {
            setFormLoading(true);
            await createPromotion(promotionData);
            setIsCreateModalOpen(false);
            await fetchPromotions(); // Refresh the list
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
            await updatePromotion(selectedPromotion.id, promotionData);
            setIsEditModalOpen(false);
            setSelectedPromotion(null);
            await fetchPromotions(); // Refresh the list
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
            await deletePromotion(selectedPromotion.id);
            setIsDeleteModalOpen(false);
            setSelectedPromotion(null);
            await fetchPromotions(); // Refresh the list
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

    if (loading) {
        return <div className="loading">Loading promotions...</div>;
    }

    return (
        <div className="promotions-container">
            <div className="promotions-header">
                <h1>Promotions</h1>
                <button 
                    className="btn-primary"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Create New Promotion
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            <div className="table-container">
                <table className="promotions-table">
                    <thead>
                        <tr>
                            <th>Promotion Name</th>
                            <th>Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>User Group Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promotions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="no-data">
                                    No promotions found
                                </td>
                            </tr>
                        ) : (
                            promotions.map((promotion) => (
                                <tr key={promotion.id}>
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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
};

export default PromotionsTable;