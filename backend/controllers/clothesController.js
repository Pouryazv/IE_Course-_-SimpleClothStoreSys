const Clothes = require('../schemas/Clothes');

exports.addClothes = async (req, res) => {
    
    try {
        const { name, material, price, discount } = req.body;
        let clothes = new Clothes({ 
            name, 
            material, 
            price, 
            discount,
            owner: req.user._id
        });
        await clothes.save();
        res.status(201).send(clothes);
    } catch (error) {
        res.status(400).send({ message: 'Error adding clothes', error: error.message });
    }
};

exports.editClothes = async (req, res) => {
    const clothesId = req.params.id;

    try {
        let clothes = await Clothes.findById(clothesId);

        if (!clothes) {
            return res.status(404).send({ message: 'Clothes not found' });
        }

        if (clothes.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'Unauthorized to edit this clothes' });
        }

        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'material', 'price', 'discount'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ message: 'Invalid updates!' });
        }

        updates.forEach(update => clothes[update] = req.body[update]);
        await clothes.save();

        res.send(clothes);
    } catch (error) {
        res.status(400).send({ message: 'Error updating clothes', error: error.message });
    }
};

exports.deleteClothes = async (req, res) => {
    const clothesId = req.params.id;

    try {
        const clothes = await Clothes.findById(clothesId);

        if (!clothes) {
            return res.status(404).send({ message: 'Clothes not found' });
        }

        if (clothes.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'Unauthorized to delete this clothes' });
        }

        await Clothes.deleteOne({ _id: clothesId });
        res.send({ message: 'Clothes deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting clothes', error: error.message });
    }
};

exports.getClothes = async (req, res) => {
    const clothesId = req.params.id;

    try {
        const clothes = await Clothes.findById(clothesId, 'name material price discount');

        if (!clothes) {
            return res.status(404).send({ message: 'Clothes not found' });
        }

        res.send(clothes);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving clothes', error: error.message });
    }
};

exports.deleteAllClothesByOwner = async (req, res) => {
    try {
        const ownerId = req.user._id;  
        await Clothes.deleteMany({ owner: ownerId });
        res.send({ message: 'All clothes items of the owner deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting clothes items', error: error.message });
    }
};

exports.getFinalPrice = async (req, res) => {
    const clothesId = req.params.id;

    try {
        const clothes = await Clothes.findById(clothesId);

        if (!clothes) {
            return res.status(404).send({ message: 'Clothes not found' });
        }

        const finalPrice = clothes.price * (1 - (clothes.discount / 100));

        res.send({ finalPrice: finalPrice });
    } catch (error) {
        res.status(500).send({ message: 'Error calculating final price', error: error.message });
    }
};
