// client/src/pages/ChitChat/components/ChatWindow.tsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Skeleton,
  Tooltip,
  Divider,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import TradeOfferModal from './TradeOfferModal';
import ComplaintModal from './ComplaintModal';
import FinishTradeModal from './FinishTradeModal';
import MessageBubble from './MessageBubble';
import { chatAPI, Chat, Message } from '../../../services/api';

// Иконки из public/assets
const ProfileIcon = ({ active }: { active?: boolean }) => (
  <img 
    src={active ? "/assets/profile-view-active.svg" : "/assets/profile-view-default.svg"} 
    alt="Profile" 
    style={{ width: 35, height: 35 }}
  />
);

const ComplaintIcon = ({ active }: { active?: boolean }) => (
  <img 
    src={active ? "/assets/complaint-active.svg" : "/assets/complaint-default.svg"} 
    alt="Complaint" 
    style={{ width: 35, height: 35 }}
  />
);

const AttachIcon = ({ active }: { active?: boolean }) => (
  <img 
    src={active ? "/assets/attach-active.svg" : "/assets/attach-default.svg"} 
    alt="Attach" 
    style={{ width: 35, height: 35 }}
  />
);

const SubmitTradeIcon = ({ active }: { active?: boolean }) => (
  <img 
    src={active ? "/assets/submit-finished-trade-active.svg" : "/assets/submit-finished-trade-default.svg"} 
    alt="Finish Trade" 
    style={{ width: 35, height: 35 }}
  />
);

interface TradeAd {
  id: string;
  title: string;
  status: string;
  photo?: string;
  userId?: string;
}

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onSendTradeOffer: (file: File) => void;
  onAcceptTrade: (offerId: string) => void;
  onRejectTrade: (offerId: string) => void;
  onSubmitComplaint: (reason: string, details: string) => void;
  onFinishTrade: (tradeId: string, rating: number, comment: string) => void;
  loadingMessages: boolean;
  currentUser: any;
  hasMoreMessages?: boolean;
  onLoadMoreMessages?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  onSendMessage,
  onSendTradeOffer,
  onAcceptTrade,
  onRejectTrade,
  onSubmitComplaint,
  onFinishTrade,
  loadingMessages,
  currentUser,
  hasMoreMessages = false,
  onLoadMoreMessages,
}) => {
  const [message, setMessage] = useState('');
  const [showTradeOfferModal, setShowTradeOfferModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showFinishTradeModal, setShowFinishTradeModal] = useState(false);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const [processingOfferId, setProcessingOfferId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  // Прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
  // Следим за обновлением статуса в реальном времени
  if (chat.tradeAd?.status === 'COMPLETED') {
    // Если статус COMPLETED, кнопка должна скрыться
    // Убедимся, что состояние обновилось
    console.log('Trade completed, hiding finish button');
  }
}, [chat.tradeAd?.status]);

useEffect(() => {
  if (shouldScrollToBottom && messages.length > 0) {
    const container = messagesContainerRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      if (isAtBottom) {
        scrollToBottom();
      }
    }
  }
}, [messages, shouldScrollToBottom]);

  // Обработчик прокрутки для бесконечной загрузки
const handleScroll = useCallback(() => {
  const container = messagesContainerRef.current;
  if (!container) return;
  
  // Проверяем, находится ли пользователь внизу контейнера
  const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
  setShouldScrollToBottom(isAtBottom);
  
  // Проверяем, достигли ли мы верха (50px от верха) для загрузки предыдущих сообщений
  if (container.scrollTop <= 50 && !loadingMessages && hasMoreMessages && onLoadMoreMessages) {
    onLoadMoreMessages();
  }
}, [loadingMessages, hasMoreMessages, onLoadMoreMessages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Добавим useEffect для парсинга статуса при загрузке сообщений
useEffect(() => {
  if (messages.length > 0 && chat?.tradeAd?.id) {
    const checkTradeOfferStatus = () => {
      // Ищем все сообщения с трейд-офферами в этом чате
      const tradeOfferMessages = messages.filter(msg => 
        msg.content.startsWith('[TRADE_OFFER]')
      );
      
      // Проверяем, есть ли принятый трейд-оффер
      const acceptedOffer = tradeOfferMessages.find(msg => 
        msg.content.includes('|ACCEPTED')
      );
      
      if (acceptedOffer && chat.tradeAd && chat.tradeAd.status !== 'ACCEPTED') {
        // Обновляем статус чата (только локально)
        // Родительский компонент уже должен был обновить статус
        // Это дополнительная проверка на случай, если статус не синхронизирован
      }
    };
    
    checkTradeOfferStatus();
  }
}, [messages, chat]);

useEffect(() => {
  // При смене чата сбрасываем shouldScrollToBottom на true
  setShouldScrollToBottom(true);
}, [chat.id]);

  // Функция для получения текста статуса
const getStatusText = (status: string | undefined) => {
  switch (status) {
    case 'ACTIVE': return 'Available';
    case 'PENDING': return 'In Progress'; // Оффер отправлен или принят
    case 'COMPLETED': return 'Completed';
    case 'CANCELLED': return 'Cancelled';
    default: return 'Available';
  }
};

const handleSendMessage = () => {
  if (message.trim()) {
    onSendMessage(message);
    setMessage('');
    setShouldScrollToBottom(true);
  }
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachTradeOffer = () => {
    setShowTradeOfferModal(true);
  };

  const handleViewProfile = () => {
    if (!chat?.otherUser?.id) {
      console.error('No user ID available for profile view');
      return;
    }
    
    window.open(`/profile/${chat.otherUser.id}`, '_blank');
  };

  const handleReport = () => {
    setShowComplaintModal(true);
  };

  const handleFinishTrade = () => {
    setShowFinishTradeModal(true);
  };

  const handleAcceptTradeOffer = async (offerId: string) => {
    if (processingOfferId) return; // Предотвращаем повторные нажатия
    
    setProcessingOfferId(offerId);
    try {
      await onAcceptTrade(offerId);
      // После принятия, обновляем статус в локальном состоянии
      if (chat.tradeAd) {
        chat.tradeAd.status = 'ACCEPTED';
      }
    } finally {
      setProcessingOfferId(null);
    }
  };

  const handleRejectTradeOffer = async (offerId: string) => {
    if (processingOfferId) return;
    
    setProcessingOfferId(offerId);
    try {
      await onRejectTrade(offerId);
      // После отклонения, обновляем статус в локальном состоянии
      if (chat.tradeAd) {
        chat.tradeAd.status = 'ACTIVE';
      }
    } finally {
      setProcessingOfferId(null);
    }
  };

const isTradeReadyToFinish = useMemo(() => {
  if (!chat.tradeAd?.id) return false;
  
  // Если статус уже COMPLETED, кнопка должна быть скрыта
  if (chat.tradeAd.status === 'COMPLETED') {
    return false;
  }
  
  // Проверяем, является ли текущий пользователь участником сделки
  const isOwner = chat.tradeAd.userId === currentUser.id;
  const isOfferSender = messages.some(msg => 
    msg.content.startsWith('[TRADE_OFFER]') && 
    msg.senderId === currentUser.id
  );
  
  if (!isOwner && !isOfferSender) return false;
  
  // Проверяем, есть ли принятый трейд-оффер
  const hasAcceptedTradeOffer = messages.some(msg => 
    msg.content.startsWith('[TRADE_OFFER]') && 
    msg.content.includes('|ACCEPTED')
  );
  
  if (!hasAcceptedTradeOffer) return false;
  
  // Показываем кнопку только если статус PENDING и сделка еще не завершена
  return chat.tradeAd.status === 'PENDING';
}, [chat.tradeAd?.status, chat.tradeAd?.id, messages, currentUser.id, chat.tradeAd?.userId]);

  // Может ли текущий пользователь прикреплять trade offer
  // Только если: есть tradeAd, пользователь НЕ владелец объявления, статус ACTIVE (нет ожидающих предложений)
  const canAttachTradeOffer = chat.tradeAd && 
                              chat.tradeAd.userId && 
                              chat.tradeAd.userId !== currentUser.id && 
                              chat.tradeAd.status === 'ACTIVE';

  const handleFinishTradeSubmit = (rating: number, comment: string) => {
    if (chat.tradeAd?.id) {
      onFinishTrade(chat.tradeAd.id, rating, comment);
      setShowFinishTradeModal(false);
    }
  };

  const handleSendTradeOfferWrapper = async (file: File) => {
    onSendTradeOffer(file);
    setShowTradeOfferModal(false);
    // После отправки предложения статус меняется на PENDING
    if (chat.tradeAd) {
      chat.tradeAd.status = 'PENDING';
    }
  };

  const handleSubmitComplaintWrapper = async (reason: string, details: string) => {
    onSubmitComplaint(reason, details);
    setShowComplaintModal(false);
  };

  return (
    <Box
      sx={{
        flex: '1 1 0',
        alignSelf: 'stretch',
        paddingTop: 2,
        paddingBottom: 2,
        background: 'white',
        borderRadius: 2,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 1,
        display: 'inline-flex',
        overflow: 'hidden',
      }}
    >
      {/* Верхняя панель с информацией об объявлении */}
<Box
  sx={{
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 1,
    display: 'inline-flex',
    px: 2,
    py: 1,
  }}
>
  {chat.tradeAd ? (
    <Box
      sx={{
        paddingLeft: 0.5,
        paddingRight: 0.5,
        paddingTop: 0.2,
        paddingBottom: 0.2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 1,
        display: 'flex',
        borderRadius: 1,
      }}
    >
      {/* Аватар объявления */}
      <Box
        sx={{
          width: 56,
          height: 56,
          padding: 1,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          display: 'flex',
        }}
      >
        <img
          style={{ width: 40, height: 40, borderRadius: '50%' }}
          src={chat.tradeAd.photo || 'https://placehold.co/40x40'}
          alt={chat.tradeAd.title || 'Trade Item'}
        />
      </Box>
      
      {/* Информация об объявлении */}
      <Box sx={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 0.5, display: 'flex' }}>
        <Typography
          sx={{
            color: '#560D30',
            fontSize: 15,
            fontFamily: '"McLaren", cursive',
            fontWeight: 400,
            wordWrap: 'break-word',
          }}
        >
          {chat.tradeAd.title || 'Trade Item'}
        </Typography>
        <Typography
          sx={{
            color: '#852654',
            fontSize: 11,
            fontFamily: '"Nobile", sans-serif',
            fontWeight: 400,
            wordWrap: 'break-word',
          }}
        >
          Status: {getStatusText(chat.tradeAd.status)}
        </Typography>
      </Box>
    </Box>
  ) : (
    <Typography
      sx={{
        color: '#852654',
        fontSize: 14,
        fontFamily: '"Nobile", sans-serif',
        fontStyle: 'italic',
      }}
    >
      No trade ad associated with this chat
    </Typography>
  )}
  
  {/* Иконки действий */}
  <Box
    sx={{
      flex: '1 1 0',
      paddingLeft: 2,
      paddingRight: 2,
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 2.5,
      display: 'flex',
    }}
  >
    <Tooltip title="View Profile">
      <IconButton
        onClick={handleViewProfile}
        onMouseEnter={() => setActiveIcon('profile')}
        onMouseLeave={() => setActiveIcon(null)}
        sx={{ p: 0 }}
      >
        <ProfileIcon active={activeIcon === 'profile'} />
      </IconButton>
    </Tooltip>
    
    <Tooltip title="Report User">
      <IconButton
        onClick={handleReport}
        onMouseEnter={() => setActiveIcon('complaint')}
        onMouseLeave={() => setActiveIcon(null)}
        sx={{ p: 0 }}
      >
        <ComplaintIcon active={activeIcon === 'complaint'} />
      </IconButton>
    </Tooltip>
  </Box>
</Box>
      
      {/* Разделительная линия */}
      <Divider
        sx={{
          width: '100%',
          height: '2px',
          background: 'rgba(86, 13, 48, 0.50)',
        }}
      />
      
      {/* Окно сообщений */}
      <Box
        ref={messagesContainerRef}
        sx={{
          alignSelf: 'stretch',
          flex: '1 1 0',
          padding: 2,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 1,
          display: 'flex',
          overflowY: 'auto',
          maxHeight: '400px',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(240, 94, 186, 0.1)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#F05EBA',
            borderRadius: '3px',
          },
        }}
      >
        {loadingMessages && messages.length === 0 ? (
          // Skeleton для сообщений при первой загрузке
          <>
            {[1, 2, 3].map(i => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start',
                  width: '100%',
                  mb: 2,
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width={i === 3 ? '400px' : '300px'}
                  height={i === 3 ? 280 : 80}
                  sx={{ borderRadius: 2 }}
                />
              </Box>
            ))}
          </>
        ) : (
          // Сообщения
          <>
            {/* Индикатор загрузки дополнительных сообщений */}
            {loadingMessages && messages.length > 0 && (
              <Box sx={{ alignSelf: 'center', py: 2 }}>
                <CircularProgress size={24} sx={{ color: '#EC2EA6' }} />
              </Box>
            )}
            
            {/* Сообщения */}
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === currentUser.id}
                formatTime={(date) => new Date(date).toLocaleTimeString([], { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                }).toUpperCase()}
                onAcceptTrade={handleAcceptTradeOffer}
                onRejectTrade={handleRejectTradeOffer}
                processingOfferId={processingOfferId}
                chatStatus={chat.tradeAd?.status}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>
      
      {/* Поле ввода сообщения */}
      <Box
        sx={{
          alignSelf: 'stretch',
          boxShadow: '0px 0px 8px #F6C4D4',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 1,
          display: 'inline-flex',
          px: 2,
          py: 1,
        }}
      >
        <Box
          sx={{
            flex: '1 1 0',
            paddingLeft: 2,
            paddingRight: 2,
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'flex',
            gap: 2,
          }}
        >
          {/* Поле ввода */}
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                borderColor: '#F6C4D4',
                '&:hover fieldset': {
                  borderColor: '#EC2EA6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#EC2EA6',
                  borderWidth: 2,
                },
                height: 56,
              },
              flex: 1,
            }}
          />
          
          {/* Иконки действий */}
          <Box sx={{ height: 56, justifyContent: 'center', alignItems: 'center', gap: 1, display: 'flex' }}>
            {/* Иконка отправки */}
            <Tooltip title="Send Message">
              <IconButton
                onClick={handleSendMessage}
                disabled={!message.trim()}
                sx={{
                  color: message.trim() ? 'white' : '#560D30',
                  background: message.trim() 
                    ? 'linear-gradient(90deg, #EC2EA6 0%, #F05EBA 100%)'
                    : 'rgba(240, 94, 186, 0.1)',
                  '&:hover': {
                    background: message.trim()
                      ? 'linear-gradient(90deg, #F05EBA 0%, #EC2EA6 100%)'
                      : 'rgba(240, 94, 186, 0.2)',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Tooltip>
            
            {/* Иконка прикрепления файла - только если можно */}
            {canAttachTradeOffer && (
              <Tooltip title="Attach Trade Offer">
                <IconButton
                  onClick={handleAttachTradeOffer}
                  onMouseEnter={() => setActiveIcon('attach')}
                  onMouseLeave={() => setActiveIcon(null)}
                  sx={{ p: 0 }}
                >
                  <AttachIcon active={activeIcon === 'attach'} />
                </IconButton>
              </Tooltip>
            )}
            
            {/* Иконка завершения сделки - только если статус PENDING и есть accepted оффер */}
            {isTradeReadyToFinish && (
              <Tooltip title="Submit Finished Trade">
                <IconButton
                  onClick={handleFinishTrade}
                  onMouseEnter={() => setActiveIcon('finish')}
                  onMouseLeave={() => setActiveIcon(null)}
                  sx={{ p: 0 }}
                >
                  <SubmitTradeIcon active={activeIcon === 'finish'} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>

      {/* Модальные окна */}
      <TradeOfferModal
        open={showTradeOfferModal}
        onClose={() => setShowTradeOfferModal(false)}
        onSendOffer={handleSendTradeOfferWrapper}
        tradeAd={chat.tradeAd}
      />
      
      <ComplaintModal
        open={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
        onSubmit={handleSubmitComplaintWrapper}
        reportedUser={chat.otherUser}
      />
      
      <FinishTradeModal
        open={showFinishTradeModal}
        onClose={() => setShowFinishTradeModal(false)}
        onFinishTrade={handleFinishTradeSubmit}
        tradeAd={chat.tradeAd}
        otherUser={chat.otherUser}
      />
    </Box>
  );
};

export default ChatWindow;