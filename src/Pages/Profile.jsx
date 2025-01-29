import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import rocket from '../assets/icons/rocket.png';
import InputField from '../components/Global/InputField';
import { fetchProfile, updateProfile, setProfile } from '../features/profileSlice'; // Ensure this path is correct
import { toast } from 'react-toastify';
import BoxHeader from '../components/Global/BoxHeader';
import ToggleButton from '../components/Global/ToggleButton';
import { useLoading } from '../context/LoadingContext';

const Profile = () => {
    const dispatch = useDispatch();
    const { isButtonDisabled, disableButtonTemporarily } = useLoading();
    const profile = useSelector((state) => state.profile);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    const handleEditProfile = async () => {
        disableButtonTemporarily();
        try {
            const data = await dispatch(updateProfile({
                user_name: profile.username,
                bio: profile.bio,
                profile_photo: profile.profilePhoto,
            })).unwrap();

            toast.success(data?.message, { autoClose: 1000 });
            console.log('Profile updated successfully:', data);
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating profile', { autoClose: 1000 });
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveChanges = () => {
        handleEditProfile();
    };

    const handleChange = (field, value) => {
        dispatch(setProfile({ ...profile, [field]: value }));
    };

    const formattedDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '';

    return (
        <div className='border flex justify-center items-center py-[55px] px-2 sm:px-4 w-full'>
            <div className='relative w-full max-w-[830px] border-t-[5px] border-t-[#fff] border-l-[5px] border-l-[#fff] border-r-[2px] border-r-[#353535] border-b-[2px] border-b-[#353535]'>
                <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>
                <BoxHeader label='Edit Profile' />
                <div className='secondary-bg p-[10px] sm:p-[14px]'>
                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                            <div className='w-full flex flex-col gap-9 px-[10px] py-[30px] sm:p-[30px]'>
                                <InputField
                                    label="Username:"
                                    value={profile.username}
                                    onChange={(e) => handleChange('username', e.target.value)}
                                    disabled={!isEditing} // Only disable when not editing
                                />
                                <InputField
                                    label="Bio:"
                                    value={profile.bio}
                                    onChange={(e) => handleChange('bio', e.target.value)}
                                    disabled={!isEditing} // Only disable when not editing
                                />

                                <ToggleButton label="Hide Followers:" />
                                <ToggleButton label="Hide Following:" />
                                <ToggleButton label="Hide Coins Purchases:" />
                                <ToggleButton label="Hide Deployed Chain:" />
                                <ToggleButton label="Notifications:" /> 
                               {/* <div className='flex flex-col sm:flex-row sm:items-center items-start gap-4'>
                                    <label className='formLabel min-w-auto md:min-w-[150px] text-right'>Trust Score:</label>
                                    <div className='w-full'>
                                        <div className='w-full flex flex-col items-center bg-[#7E78AA] p-1'>
                                            <div className={`relative overflow-hidden bg-[#E9E9E9] h-[17.442px] w-full after:absolute after:bg-[#15C570] after:w-[${profile.trustScore}] after:h-[full] after:bottom-[-5px] after:left-[0px] after:top-[0px]`}></div>
                                        </div>
                                        <div className='flex justify-end items-end w-full'>
                                            <h5 className='PixelOperatorbold text-[12px] md:text-[13px] mt-1'>{profile.trustScore}/100</h5>
                                        </div>
                                    </div>
                                </div> */}
                                {/* Use the correct profile object */}
                                <InputField label="Member Since:" value={formattedDate} disabled={true} />
                                <div className='pl-0 md:pl-[165px]'>
                                    {isEditing ? (
                                        <button
                                            onClick={handleSaveChanges}
                                            className='themeBtn SegoeUi w-fit'
                                            disabled={isButtonDisabled}
                                        >
                                            <span>Save Changes</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleEditClick}
                                            className='themeBtn SegoeUi w-fit'
                                        >
                                            <span>Edit Profile</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
