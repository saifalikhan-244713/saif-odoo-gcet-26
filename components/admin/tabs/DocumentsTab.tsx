import React from 'react';
import FormInput from '@/components/FormInput';

interface DocumentsTabProps {
    documents: { id: number; name: string; file: File | null }[];
    handleDocumentChange: (id: number, field: 'name' | 'file', value: string | File | null) => void;
    addDocument: () => void;
    removeDocument: (id: number) => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents, handleDocumentChange, addDocument, removeDocument }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Employee Documents</h2>
                <p className="text-gray-500">Upload necessary documents for the employee.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                {documents.map((doc) => (
                    <div key={doc.id} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <FormInput
                                label="Document Name"
                                placeholder="e.g. ID Proof, PAN Card"
                                value={doc.name}
                                onChange={(e) => handleDocumentChange(doc.id, 'name', e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700 block mb-2">Upload File</label>
                            <input
                                type="file"
                                className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-lg file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-indigo-50 file:text-indigo-700
                                                    hover:file:bg-indigo-100
                                                    border border-gray-300 rounded-lg p-1.5"
                                onChange={(e) => handleDocumentChange(doc.id, 'file', e.target.files ? e.target.files[0] : null)}
                            />
                        </div>
                        {documents.length > 1 && (
                            <button
                                onClick={() => removeDocument(doc.id)}
                                className="mb-1.5 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        )}
                    </div>
                ))}

                <button
                    onClick={addDocument}
                    className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Another Document
                </button>
            </div>
        </div>
    );
};

export default DocumentsTab;
