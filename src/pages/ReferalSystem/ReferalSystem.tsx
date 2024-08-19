import React, { useState, useEffect } from 'react';
import { initUtils, useInitData, useLaunchParams } from '@telegram-apps/sdk-react';
import './ReferalSystem.css';
import FooterMenu from '../FooterMenu/FooterMenu';
import ticketDiscount from "./ticket-discount.png";

interface Referral {
  id: number;
  date: string;
  user_tg_id: number;
  friend_tg_id: number;
  points: number;
  username: string | null;
}

const ReferralSystem: React.FC = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [referralLink, setReferralLink] = useState('');

  const initData = useInitData();
  const lp = useLaunchParams();

  useEffect(() => {
    const initApp = async () => {
      if (initData?.user) {
        const userId = initData.user.id;
        const username = initData.user.username || null;

        if (userId) {
          const botUsername = "tesase_bot";
          // Используем startapp для Mini App
          const newReferralLink = `https://t.me/${botUsername}?startapp=${userId}`;
          setReferralLink(newReferralLink);

          console.log('Launch Params:', lp);
          console.log('Start Param:', lp.startParam);
          
          // Проверка и обработка startParam
          if (lp.startParam) {
            const referrerId = parseInt(lp.startParam, 10);
            if (!isNaN(referrerId) && referrerId !== userId) {
              await createReferral(referrerId, userId, username);
            }
          }

          fetchUserReferrals(userId);
        }
      }
    };

    initApp();
  }, [initData, lp]);

  const createReferral = async (referrerId: number, userId: number, username: string | null) => {
    try {
      console.log(`Attempting to create referral: referrerId=${referrerId}, userId=${userId}, username=${username}`);
      
      // Проверка существующего реферала
      const existingReferrals = await fetch(`https://d84c-38-180-23-221.ngrok-free.app/referrals/${referrerId}`, {
        headers: {
          'ngrok-skip-browser-warning': '69420'
        }
      });
      const existingReferralsData = await existingReferrals.json();
      
      if (existingReferralsData.some((ref: Referral) => ref.friend_tg_id === userId)) {
        console.log('Referral already exists');
        return;
      }

      const response = await fetch(`https://d84c-38-180-23-221.ngrok-free.app/referrals/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        },
        body: JSON.stringify({
          user_tg_id: referrerId,
          friend_tg_id: userId,
          username: username
        }),
      });

      if (response.ok) {
        console.log('Referral created successfully');
        fetchUserReferrals(userId);
      } else {
        console.error('Failed to create referral:', await response.text());
      }
    } catch (error) {
      console.error('Error creating referral:', error);
    }
  };

  const fetchUserReferrals = async (userId: number) => {
    try {
      console.log(`Fetching referrals for user ${userId}`);
      const referralsResponse = await fetch(`https://d84c-38-180-23-221.ngrok-free.app/referrals/${userId}`, {
        headers: {
          'ngrok-skip-browser-warning': '69420'
        }
      });
      const pointsResponse = await fetch(`https://d84c-38-180-23-221.ngrok-free.app/referrals/${userId}/points`, {
        headers: {
          'ngrok-skip-browser-warning': '69420'
        }
      });

      const referralsData: Referral[] = await referralsResponse.json();
      const { total_points } = await pointsResponse.json();

      console.log('Fetched referrals:', referralsData);
      setReferrals(referralsData);
      setTotalPoints(total_points);
    } catch (error) {
      console.error('Error fetching user referrals:', error);
    }
  };

  const handleInviteFriend = () => {
    const utils = initUtils();
    utils.shareURL(
      referralLink,
      'Join me on this awesome app!'
    );
  };

  const getDisplayName = (referral: Referral): string => {
    if (referral.username) {
      return referral.username;
    }
    // If the referral is for the current user and we have their InitData
    if (initData?.user && initData.user.id === referral.friend_tg_id) {
      return initData.user.username || initData.user.firstName || `User ${referral.friend_tg_id}`;
    }
    // If no username is available, return the ID
    return `User ${referral.friend_tg_id}`;
  };

  const getInitial = (referral: Referral): string => {
    const displayName = getDisplayName(referral);
    return displayName[0].toUpperCase();
  };

  return (
    <div className="referral-container">
      <div className="info-section">
        <p>
          Get a <img className="ticket-discount" src={ticketDiscount} alt="Ticket discount" /> play pass for each fren.
        </p>
      </div>

      <div className="friends-section">
        <h3>{referrals.length} Frens</h3>
        <ul>
          {referrals.map((referral) => (
            <li key={referral.id} className="friend-item">
              <div className="friend-info">
                <div className="friend-avatar">
                  {getInitial(referral)}
                </div>
                <span>{getDisplayName(referral)}</span>
              </div>
              <span className="friend-points">{referral.points} BP</span>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleInviteFriend} className="invite-button">
        Invite a fren
      </button>

      <div className="total-points">
        <h3>Total Points: {totalPoints}</h3>
      </div>

      <FooterMenu />
    </div>
  );
};

export default ReferralSystem;