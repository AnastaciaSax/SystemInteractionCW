const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const connectionString = 'postgresql://postgres:nicole6660903B@localhost:5432/collector_mingle';

async function setupDatabase() {
  console.log('🚀 Starting database setup...');
  
  const client = new Client({
    connectionString: connectionString
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Read and execute SQL file
    console.log('📝 Creating tables...');
    const sql = fs.readFileSync(
      path.join(__dirname, 'prisma', 'migrations', 'init', 'migration.sql'), 
      'utf8'
    );
    await client.query(sql);
    console.log('✅ Tables created');

    // Hash passwords
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedUser1Password = await bcrypt.hash('valentina123', 10);
    const hashedUser2Password = await bcrypt.hash('amalia123', 10);
    const hashedUser3Password = await bcrypt.hash('michael123', 10);

    // Insert Users
    console.log('👤 Inserting users...');
    await client.query(`
      INSERT INTO "User" (id, email, username, password, role, age, "parentEmail", "isVerified", region, "createdAt", "updatedAt") VALUES
      ('admin_001', 'admin@collector.com', 'Admin', $1, 'ADMIN', 30, NULL, true, 'EU', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('user_001', 'valentina@example.com', 'Valentina', $2, 'USER', 10, 'parent@example.com', true, 'CIS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('user_002', 'amalia@example.com', 'Amalia', $3, 'USER', 18, NULL, true, 'EU', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('user_003', 'michael@example.com', 'Michael', $4, 'USER', 35, NULL, true, 'USA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [hashedAdminPassword, hashedUser1Password, hashedUser2Password, hashedUser3Password]);

    // Insert Profiles
    await client.query(`
      INSERT INTO "Profile" (id, "userId", avatar, bio, location, rating, status, achievements, "tradeCount") VALUES
      ('profile_001', 'admin_001', '/assets/admin-avatar.png', 'Platform administrator and LPS expert', 'Berlin, Germany', 5.0, 'Expert', ARRAY['Founder', 'Moderator', 'Verified Expert'], 42),
      ('profile_002', 'user_001', '/assets/avatar1.png', 'Young LPS collector, loves G2 series', 'Moscow, Russia', 4.2, 'Beginner', ARRAY['First Trade', 'Active Member'], 3),
      ('profile_003', 'user_002', '/assets/avatar2.png', 'Student and LPS enthusiast, collecting since 2010', 'Hamburg, Germany', 4.8, 'Active Trader', ARRAY['10+ Trades', 'Helpful Member'], 15),
      ('profile_004', 'user_003', '/assets/avatar3.png', 'Collector of rare LPS figures, focus on exclusives', 'New York, USA', 4.9, 'Expert', ARRAY['Rare Finds', 'Trusted Trader', 'Collection Advisor'], 28)
    `);

    // Insert Figurines (from Wishlist data) - УБИРАЕМ ДУБЛИКАТЫ 'N/A'
    console.log('🎯 Inserting figurines...');
    await client.query(`
      INSERT INTO "Figurine" (id, number, name, mold, series, rarity, year, description, "imageUrl", verified) VALUES
      -- Wishlist items
      ('fig_001', '#1063', 'Gray Tabby Cat', 'CAT', 'G2', 'RARE', 2007, 'Gray tabby cat with green eyes', '/assets/wish1.png', true),
      ('fig_002', '#1607', 'White Persian Cat', 'CAT', 'G2', 'COMMON', 2008, 'White persian cat with blue eyes', '/assets/wish2.png', true),
      ('fig_003', '#2291', 'Siamese Cat', 'CAT', 'G3', 'EXCLUSIVE', 2009, 'Rare siamese cat with crossed eyes', '/assets/wish3.png', true),
      ('fig_004', '#2286', 'Dachshund Dog', 'DOG', 'G2', 'UNCOMMON', 2011, 'Brown dachshund with floppy ears', '/assets/wish4.png', true),
      ('fig_005', '#1879', 'Highland Cow', 'CATTLE', 'G3', 'COMMON', 2010, 'Fluffy highland cow with horns', '/assets/wish5.png', true),
      ('fig_006', '#2242', 'Hamster', 'RODENT', 'G3', 'RARE', 2011, 'Golden hamster with cheek pouches', '/assets/wish6.png', true),
      ('fig_007', '#265', 'Guinea Pig', 'RODENT', 'G4', 'RARE', 2014, 'Multicolored guinea pig', '/assets/wish7.png', true),
      -- Additional figurines for Trade - ИЗМЕНЯЕМ НОМЕРА НА УНИКАЛЬНЫЕ
      ('fig_008', '#CUSTOM001', 'Wolf / Persian Cat', 'CAT', 'G5', 'UNCOMMON', 2015, 'Wolf-like persian cat hybrid', '/assets/fig8.png', true),
      ('fig_009', '#CUSTOM002', 'Blue Sky Poodle', 'DOG', 'G2', 'RARE', 2006, 'Blue poodle with curly fur', '/assets/fig9.png', true),
      ('fig_010', '#CUSTOM003', 'Mint Polar Bear', 'BEAR', 'G2', 'EXCLUSIVE', 2006, 'Mint green polar bear', '/assets/fig10.png', true),
      ('fig_011', '#CUSTOM004', 'Australian Dachshund', 'DOG', 'G2', 'UNCOMMON', 2007, 'Dachshund with australian colors', '/assets/fig11.png', true),
      ('fig_012', '#CUSTOM005', 'Gentle Maltese', 'DOG', 'G6', 'COMMON', 2018, 'White maltese dog with bow', '/assets/fig12.png', true),
      ('fig_013', '#CUSTOM006', 'Stripped Kitty Dressed', 'CAT', 'G6', 'RARE', 2018, 'Cat in striped dress', '/assets/fig13.png', true),
      ('fig_014', '#CUSTOM007', 'Tan Kangaroo', 'KANGAROO', 'G3', 'EXCLUSIVE', 2010, 'Tan kangaroo with joey', '/assets/fig14.png', true)
    `);

    // Insert Wishlist Items
    console.log('📋 Inserting wishlist items...');
    await client.query(`
      INSERT INTO "WishlistItem" (id, "userId", "figurineId", note, priority) VALUES
      ('wish_001', 'user_001', 'fig_001', 'Need for G2 cat collection', 1),
      ('wish_002', 'user_001', 'fig_002', 'Common but missing', 2),
      ('wish_003', 'user_002', 'fig_003', 'Exclusive find!', 1),
      ('wish_004', 'user_002', 'fig_004', 'Love dachshunds', 3),
      ('wish_005', 'user_003', 'fig_005', 'For farm collection', 2),
      ('wish_006', 'user_003', 'fig_006', 'Rare rodent needed', 1),
      ('wish_007', 'user_003', 'fig_007', 'Latest release', 1)
    `);

    // Insert Trade Ads
    console.log('🏷️ Inserting trade ads...');
    await client.query(`
      INSERT INTO "TradeAd" (id, "userId", "figurineId", title, description, condition, location, status, photo, "createdAt", "updatedAt") VALUES
      ('trade_001', 'user_002', 'fig_008', 'Wolf / Persian Cat for trade', 'Looking for G2 cats or rare exclusives. This hybrid is in good condition with minor wear.', 'GOOD', 'Berlin, Germany', 'ACTIVE', '/assets/ad1.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('trade_002', 'user_003', 'fig_009', 'Blue Sky Poodle - Mint Condition', 'Rare blue poodle from G2 series. Perfect condition, never removed from display.', 'MINT', 'New York, USA', 'ACTIVE', '/assets/ad2.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('trade_003', 'user_001', 'fig_010', 'Mint Polar Bear needs TLC', 'Rare polar bear, needs some cleaning and minor repairs. Great for restoration projects.', 'TLC', 'Moscow, Russia', 'ACTIVE', '/assets/ad3.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('trade_004', 'user_002', 'fig_011', 'Australian Edition Dachshund', 'Limited edition dachshund with unique coloring. Mint in box.', 'NIB', 'Hamburg, Germany', 'ACTIVE', '/assets/ad4.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('trade_005', 'user_003', 'fig_012', 'Gentle Maltese - Good Condition', 'Sweet maltese dog from latest series. Well loved but in good shape.', 'GOOD', 'Chicago, USA', 'ACTIVE', '/assets/ad5.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('trade_006', 'user_001', 'fig_013', 'Stripped Kitty Dressed', 'Rare dressed cat figure. Mint condition, perfect for collectors.', 'MINT', 'St. Petersburg, Russia', 'ACTIVE', '/assets/ad6.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('trade_007', 'user_002', 'fig_014', 'Tan Kangaroo NIB', 'Exclusive kangaroo with joey. Never removed from original packaging.', 'NIB', 'Munich, Germany', 'ACTIVE', '/assets/ad7.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    // Insert Trade Offers
    console.log('🤝 Inserting trade offers...');
    await client.query(`
      INSERT INTO "TradeOffer" (id, "tradeAdId", "userId", message, status) VALUES
      ('offer_001', 'trade_001', 'user_001', 'I have #1063 Gray Tabby Cat, interested in your Wolf/Persian Cat', 'PENDING'),
      ('offer_002', 'trade_002', 'user_002', 'Would you trade for #2291 Siamese Cat plus my #2286 Dachshund?', 'PENDING'),
      ('offer_003', 'trade_003', 'user_003', 'I can offer professional restoration services plus #1879 Highland Cow', 'ACCEPTED')
    `);

    // Insert Messages
    console.log('💬 Inserting messages...');
    await client.query(`
      INSERT INTO "Message" (id, "senderId", "receiverId", "tradeId", content, "isRead") VALUES
      ('msg_001', 'user_001', 'user_002', 'trade_001', 'Hi! I''m interested in your Wolf/Persian Cat. When could we meet?', false),
      ('msg_002', 'user_002', 'user_001', 'trade_001', 'Hello! I could meet this Saturday in the city center.', false),
      ('msg_003', 'user_002', 'user_003', 'trade_002', 'Your Blue Sky Poodle is exactly what I need for my collection!', true),
      ('msg_004', 'user_003', 'user_002', 'trade_002', 'I''m open to offers. What do you have for trade?', true)
    `);

    // Insert Ratings/Feedback
    console.log('⭐ Inserting ratings...');
    await client.query(`
      INSERT INTO "Rating" (id, "userId", "raterId", "tradeId", score, comment) VALUES
      ('rating_001', 'user_002', 'user_001', 'trade_001', 5, 'Perfect trade! Valentina was punctual and the figure was as described.'),
      ('rating_002', 'user_001', 'user_002', 'trade_001', 4, 'Good trader, communication was clear. Figure had minor scratches not mentioned.'),
      ('rating_003', 'user_003', 'user_002', 'trade_003', 5, 'Expert collector! Michael provided authentic rare figures.'),
      ('rating_004', 'user_002', 'user_003', 'trade_002', 5, 'Professional and trustworthy. Highly recommended!')
    `);

    // Insert Articles
    console.log('📰 Inserting articles...');
    await client.query(`
      INSERT INTO "Article" (id, title, content, category, "authorId", "imageUrl", tags, published, views) VALUES
      ('art_001', 'How To Clean a Pet?', 'Complete guide to cleaning LPS figures without damaging them. Use mild soap and soft brush...', 'CARE_STORAGE', 'admin_001', '/assets/article1.png', ARRAY['#dirtylps', '#clean', '#tlc', '#revive'], true, 156),
      ('art_002', 'How To Store: Shelf or Box?', 'Pros and cons of different storage methods for LPS collections...', 'CARE_STORAGE', 'admin_001', '/assets/article2.png', ARRAY['#storage', '#display', '#collection'], true, 89),
      ('art_003', 'LPS Revamp: do''s & dont''s', 'Guide to restoring damaged figures while maintaining their value...', 'CARE_STORAGE', 'user_003', '/assets/article3.png', ARRAY['#fix', '#revamp', '#restoration'], true, 203),
      ('art_004', 'LPS Evolution: 90''s - today', 'History of Littlest Pet Shop from the beginning to modern releases...', 'HISTORY_NEWS', 'admin_001', '/assets/article4.png', ARRAY['#evolution', '#history', '#brand'], true, 342),
      ('art_005', 'BasicFun In Charge?', 'Latest news about BasicFun taking over LPS production...', 'HISTORY_NEWS', 'admin_001', '/assets/article5.png', ARRAY['#nova', '#twist', '#comeback'], true, 178),
      ('art_006', '2025: TOP Rarest Pets', 'Preview of the rarest LPS figures coming in 2025...', 'HISTORY_NEWS', 'admin_001', '/assets/article6.png', ARRAY['#news', '#rare', '#2025', '#top'], true, 415),
      ('art_007', 'Authenticity: Not To Get Bamboozled', 'How to spot fake LPS figures and ensure authenticity...', 'RULES_POLITICS', 'admin_001', '/assets/article7.png', ARRAY['#comparison', '#fake', '#authentic'], true, 267),
      ('art_008', 'Society Rules: Secure Trading', 'Community guidelines for safe and fair trading...', 'RULES_POLITICS', 'admin_001', '/assets/article8.png', ARRAY['#rules', '#trade', '#security', '#kids'], true, 134),
      ('art_009', 'How To Grow the Collection?', 'Beginner''s guide to starting and expanding an LPS collection...', 'ADVICE_BEGINNERS', 'user_003', '/assets/article9.png', ARRAY['#collect', '#grow', '#start', '#advice'], true, 189)
    `);

    console.log('\n🎉 Database successfully populated!');
    console.log('\n👤 User accounts:');
    console.log('Admin: admin@collector.com / admin123');
    console.log('Valentina: valentina@example.com / valentina123');
    console.log('Amalia: amalia@example.com / amalia123');
    console.log('Michael: michael@example.com / michael123');
    console.log('\n📊 Database contains:');
    console.log('- 4 users with profiles');
    console.log('- 14 figurines in catalog');
    console.log('- 7 wishlist items');
    console.log('- 7 trade ads');
    console.log('- 3 trade offers');
    console.log('- 4 messages');
    console.log('- 4 ratings/feedback');
    console.log('- 9 articles');
    console.log('\n🌐 Prisma Studio available at http://localhost:5555');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();