import { Service } from "../models/Service.js";

export async function listServices(req, res, next) {
  try {
    const { platform } = req.query;
    const filter = { isActive: true };
    if (platform) {
      filter.platform = platform;
    }
    const services = await Service.find(filter).sort({ platform: 1, name: 1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
}

export async function getService(req, res, next) {
  try {
    const service = await Service.findById(req.params.id);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (err) {
    next(err);
  }
}

export async function createService(req, res, next) {
  try {
    const { name, platform, pricePerUnit, providerServiceId, minQuantity, maxQuantity, description } = req.body;
    const service = await Service.create({
      name,
      platform,
      pricePerUnit,
      providerServiceId,
      minQuantity,
      maxQuantity,
      description,
    });
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
}

export async function updateService(req, res, next) {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (err) {
    next(err);
  }
}

export async function deleteService(req, res, next) {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

