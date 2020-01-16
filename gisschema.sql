DROP TABLE IF EXISTS gifts;
CREATE TABLE gifts
(
    id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    title VARCHAR(255),
    type VARCHAR(255),
    gifshelf VARCHAR(255)
);

INSERT INTO gifts
    (image, title, type, gifshelf)
VALUES
    (
        'https://media1.giphy.com/media/PoEDSg4boyn6OjnN1B/giphy-preview.gif?cid=f3d18b0351ef2a6f20a52f78be57058f383e311a65ef032f&rid=giphy-preview.gif',
        'working work in progress Sticker by Mekamee',
        'gif',
        'Computer'
);