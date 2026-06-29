import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, Search, Loader2, Download as DownloadIcon, X, Upload, FileText, Link, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ManageDownloads.module.css';

const EMPTY_FORM = { category_name: '', file_name: '', file_size: '', file_url: '' };

const ManageDownloads = () => {
    const [files, setFiles] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formData, setFormData] = React.useState(EMPTY_FORM);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [uploading, setUploading] = React.useState(false);
    const [uploadError, setUploadError] = React.useState<string | null>(null);
    const [customCategory, setCustomCategory] = React.useState('');
    const [isNewCategory, setIsNewCategory] = React.useState(false);

    React.useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        const { data } = await supabase.from('downloads').select('*').order('category_name');
        if (data) setFiles(data);
        setLoading(false);
    };

    // Calculate unique categories for suggestions
    const existingCategories = React.useMemo(() => {
        return Array.from(new Set(files.map(f => f.category_name).filter(Boolean)));
    }, [files]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadError(null);

        try {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'bhrbsq6z';
            const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || '822626638678112';
            const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET || 'wUknWCPOUAbcdHjzivm6Swh_dFE';

            const timestamp = Math.floor(Date.now() / 1000).toString();

            // Signature generation parameters: timestamp
            const signatureString = `timestamp=${timestamp}${apiSecret}`;
            const encoder = new TextEncoder();
            const data = encoder.encode(signatureString);
            const hashBuffer = await crypto.subtle.digest('SHA-1', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            uploadFormData.append('api_key', apiKey);
            uploadFormData.append('timestamp', timestamp);
            uploadFormData.append('signature', signature);
            uploadFormData.append('resource_type', 'raw'); // Force raw upload for documents

            // Upload using the /raw/upload endpoint for PDF/raw support
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
                method: 'POST',
                body: uploadFormData
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error?.message || 'Failed to upload tool helper. Please check file format.');
            }

            // Calculate human-readable file size
            const sizeInKb = file.size / 1024;
            const sizeText = sizeInKb > 1024
                ? (sizeInKb / 1024).toFixed(1) + ' MB'
                : Math.round(sizeInKb) + ' KB';

            // Auto-fill file details
            const defaultName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

            setFormData(prev => ({
                ...prev,
                file_url: result.secure_url,
                file_size: sizeText,
                file_name: prev.file_name || defaultName
            }));

        } catch (err: any) {
            console.error('File upload error:', err);
            setUploadError(err.message || 'Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const categoryToSave = isNewCategory ? customCategory : formData.category_name;

        if (!categoryToSave) {
            alert('Please select or specify a category.');
            return;
        }

        const dataToSave = {
            ...formData,
            category_name: categoryToSave
        };

        const { data } = await supabase.from('downloads').insert([dataToSave]).select();
        if (data) {
            setFiles(prev => [...prev, data[0]]);
            setIsModalOpen(false);
            setFormData(EMPTY_FORM);
            setCustomCategory('');
            setIsNewCategory(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"?`)) return;
        const { error } = await supabase.from('downloads').delete().eq('id', id);
        if (!error) setFiles(prev => prev.filter(f => f.id !== id));
    };

    const filteredFiles = files.filter(file => {
        const query = searchQuery.toLowerCase();
        return (
            file.file_name?.toLowerCase().includes(query) ||
            file.category_name?.toLowerCase().includes(query)
        );
    });

    const openAddModal = () => {
        setFormData(EMPTY_FORM);
        setUploadError(null);
        setIsNewCategory(existingCategories.length === 0);
        setIsModalOpen(true);
    };

    return (
        <div className={styles.page}>
            {/* Page Header */}
            <div className={styles.header}>
                <div>
                    <h1>Downloads & Documents</h1>
                    <p>Manage syllabus, admission forms, notices, exam routines, and other downloadable resources.</p>
                </div>
                <button className={styles.addBtn} onClick={openAddModal}>
                    <Plus size={20} /> Add Document
                </button>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBar}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search document name or category..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Documents Table */}
            {loading ? (
                <div className={styles.loader}>
                    <Loader2 className={styles.spin} size={28} /> Loading documents...
                </div>
            ) : filteredFiles.length === 0 ? (
                <div className={styles.empty}>
                    <FileText size={48} className={styles.emptyIcon} />
                    <p>{searchQuery ? 'No documents match your search query.' : 'No documents added yet.'}</p>
                </div>
            ) : (
                <div className={styles.tableCard}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>File Name</th>
                                    <th>Size</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFiles.map(file => (
                                    <tr key={file.id}>
                                        <td className={styles.categoryCell}>{file.category_name || '-'}</td>
                                        <td className={styles.fileNameCell}>{file.file_name}</td>
                                        <td>
                                            <span className={styles.sizeBadge}>{file.file_size || 'N/A'}</span>
                                        </td>
                                        <td className={styles.actionCell}>
                                            <a
                                                href={file.file_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={styles.actionBtn}
                                                title="View / Download"
                                            >
                                                <DownloadIcon size={16} />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(file.id, file.file_name)}
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Document Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className={styles.overlay} onClick={() => setIsModalOpen(false)}>
                        <motion.div
                            className={styles.modal}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <div>
                                    <h2>Add New Document</h2>
                                    <p>Upload a PDF document or insert a file URL link.</p>
                                </div>
                                <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleAdd} className={styles.form}>

                                {/* Cloudinary Document File Upload */}
                                <div className={styles.fieldGroup}>
                                    <label><Upload size={14} /> Upload PDF Document File</label>
                                    <div className={styles.uploadWrapper}>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                            id="docFileInput"
                                            className={styles.fileInput}
                                        />
                                        <label htmlFor="docFileInput" className={styles.fileLabel}>
                                            {uploading ? (
                                                <>
                                                    <Loader2 className={styles.spin} size={16} /> Uploading file to Cloudinary...
                                                </>
                                            ) : (
                                                <>
                                                    <FileText size={16} /> Choose PDF / Document File
                                                </>
                                            )}
                                        </label>
                                    </div>
                                    {uploadError && <p className={styles.uploadError}>{uploadError}</p>}
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label><Link size={14} /> Document Direct File URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://cloudinary.com/..."
                                        value={formData.file_url}
                                        onChange={e => setFormData({ ...formData, file_url: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label><FileText size={14} /> Document Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Unit Test syllabus 2024"
                                        value={formData.file_name}
                                        onChange={e => setFormData({ ...formData, file_name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label><Tag size={14} /> Document Category</label>
                                    {existingCategories.length > 0 && !isNewCategory ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <select
                                                value={formData.category_name}
                                                onChange={e => {
                                                    if (e.target.value === '__NEW__') {
                                                        setIsNewCategory(true);
                                                        setFormData(prev => ({ ...prev, category_name: '' }));
                                                    } else {
                                                        setFormData(prev => ({ ...prev, category_name: e.target.value }));
                                                    }
                                                }}
                                                required
                                            >
                                                <option value="">Select category...</option>
                                                {existingCategories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                                <option value="__NEW__">+ Create New Category</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <input
                                                type="text"
                                                placeholder="e.g. Syllabus, Notices, Exam Routines"
                                                value={customCategory}
                                                onChange={e => setCustomCategory(e.target.value)}
                                                required
                                            />
                                            {existingCategories.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsNewCategory(false)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: 'var(--primary)',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 600,
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        padding: 0
                                                    }}
                                                >
                                                    ← Choose from existing categories
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label><FileText size={14} /> File Size Details</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 450 KB or 1.2 MB"
                                        value={formData.file_size}
                                        onChange={e => setFormData({ ...formData, file_size: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.formFooter}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.submitBtn}>
                                        <Plus size={18} /> Add Document
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageDownloads;
