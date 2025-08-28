import si from 'systeminformation';
import { catchAsyncErrors } from '../../middlewares/index.js';
import { StatusCode } from '../../constants/index.js';
import { InternalServerError } from '../../utils/index.js';
export const Info = catchAsyncErrors(async (req, res, next) => {
    try {
        const [cpu, mem, osInfo, diskLayout, diskIO, fsSize, networkInterfaces, networkStats, processes, currentLoad,] = await Promise.all([
            si.cpu(),
            si.mem(),
            si.osInfo(),
            si.diskLayout(),
            si.disksIO(),
            si.fsSize(),
            si.networkInterfaces(),
            si.networkStats(),
            si.processes(),
            si.currentLoad(),
        ]);
        res.status(StatusCode.OK).json({
            success: true,
            info: {
                os: osInfo,
                cpu: {
                    manufacturer: cpu.manufacturer,
                    brand: cpu.brand,
                    speed: cpu.speed,
                    cores: cpu.cores,
                    physicalCores: cpu.physicalCores,
                    usagePercent: parseFloat(currentLoad.currentLoad.toFixed(2)),
                    perCoreLoad: currentLoad.cpus.map(c => parseFloat(c.load.toFixed(2))),
                },
                memory: {
                    total: mem.total,
                    free: mem.free,
                    used: mem.used,
                    active: mem.active,
                    available: mem.available,
                    usagePercent: parseFloat(((mem.used / mem.total) * 100).toFixed(2)),
                },
                disk: {
                    layout: diskLayout,
                    io: diskIO,
                    fileSystems: fsSize.map(fs => ({
                        fs: fs.fs,
                        type: fs.type,
                        size: fs.size,
                        used: fs.used,
                        available: fs.available,
                        usagePercent: parseFloat(fs.use.toFixed(2)),
                        mount: fs.mount,
                    })),
                },
                network: {
                    interfaces: networkInterfaces,
                    stats: networkStats,
                },
                processes: {
                    all: processes.all,
                    running: processes.running,
                    blocked: processes.blocked,
                    sleeping: processes.sleeping,
                    list: processes.list.slice(0, 100),
                },
            },
        });
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
//# sourceMappingURL=get.js.map