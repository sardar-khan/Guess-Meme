// ReferralModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { submitComment, uploadImage } from '../../utils/api';
import { useParams } from 'react-router-dom';

const ReferralModal = ({ isOpen, onClose, onSubmit, threadID, fetchThreadData }) => {
    const [comment, setComment] = useState();
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const fileInputRef = useRef(null);
    const { id } = useParams();
    console.log("threadID", comment)
    useEffect(() => {
    }, [threadID, comment])

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const formData = new FormData();
            formData.append('profile_photo', file);
            setImage(file);

            try {
                const data = await uploadImage(formData); // Upload image
                setImageUrl(data.imageUrl); // Save the uploaded image URL
                toast.success('Image uploaded successfully!');
            } catch (error) {
                toast.error(`Error uploading image: ${error.message}`);
            }
        } else {
            toast.error("Only image files are accepted.");
        }
    };

    const handleImageDrop = (e) => {
        e.preventDefault();
        handleImageUpload({ target: { files: e.dataTransfer.files } });
    };

    const handleSubmit = async () => {
        if (!comment.trim()) {
            toast.error("Comment is required.");
            return;
        }
        // if (!imageUrl) {
        //     toast.error("Please upload an image.");
        //     return;
        // }

        try {
            const data = await submitComment({
                text: comment,
                token_id: id,
                reply_id: threadID,
                image: imageUrl
            });
            console.log("Comment data", data)
            toast.success(data?.message);
            setImageUrl('');
            // fetchThreadData();
            setComment('')
            onClose();
        } catch (error) {
            toast.error(`Failed to post reply: ${error.message}`);
        }
    };

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleUploadAreaClick = () => {
        fileInputRef.current.click();
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImageUrl(null);
    };


    if (!isOpen) return null;

    return (
        <div
            className='fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center'
            onClick={handleBackgroundClick}
        >
            <div
                className='bg-[#A49DD2] p-5 rounded-lg w-[90%] max-w-lg'
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className='text-lg font-semibold mb-3'>Add a Comment</h3>

                <textarea
                    className='w-full p-2 border-2 border-gray-300 rounded-md bg-transparent placeholder:text-black'
                    rows="4"
                    placeholder={threadID ? `Replying to ${threadID}` : `Add a comment...`}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>

                {/* Image Upload */}
                <div className="mt-3">
                    {!imageUrl ? (
                        // Show Drag-and-Drop Area
                        <div
                            className="border-dashed border-2 border-gray-300 rounded-md p-2 text-center cursor-pointer"
                            onDrop={handleImageDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={handleUploadAreaClick}
                        >
                            <p className="Inter text-lg">Drag & Drop an image here, or click to upload</p>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                            />
                            {image && (
                                <p className="Inter mt-2 text-sm text-gray-600">
                                    Selected file: {image.name}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div
                            className="border-dashed border-2 border-gray-300 rounded-md p-2 text-center cursor-pointer"
                            onDrop={handleImageDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={handleUploadAreaClick}
                        >
                            <div className="text-center flex flex-col">
                                <div className='w-fit mx-auto'>
                                    <img
                                        src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${imageUrl}`}
                                        alt="Uploaded Preview"
                                        className="rounded-md border border-gray-300 h-[100px]"
                                    />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                    />
                                </div>
                                {/* <button
                                onClick={handleRemoveImage}
                                className="mt-3 px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Remove Image
                            </button> */}
                            </div>
                        </div>
                    )}
                </div>


                {/* Buttons */}
                <div className='flex justify-end mt-4 gap-3'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 bg-gray-300 !text-base'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className='themeBtn w-fit'
                    >
                        <span className='!text-base'>
                            Post Reply
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReferralModal;
