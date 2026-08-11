import { create } from "zustand";
import {
  BOS_VIDEO_STREAM_UI_MODEL,
  type VideoStreamUiModel,
} from "../models/videoStreamUiModel";

type VideoStreamStore = {
  ozet: VideoStreamUiModel;
  /** Her yayinda artan surum; veri gelip gelmedigini anlamak icin kullanilir. */
  lastUpdateId?: number;
  setOzet: (updateId: number, model: VideoStreamUiModel) => void;
  reset: () => void;
};

/**
 * Video akis ozeti yalnizca `videoStreamUiPublisher` tarafindan, sabit
 * arayla guncellenir. Kare basina (30 fps) render tetiklenmez.
 */
export const useVideoStreamStore = create<VideoStreamStore>((set) => ({
  ozet: BOS_VIDEO_STREAM_UI_MODEL,
  lastUpdateId: undefined,

  setOzet: (updateId, model) =>
    set({
      ozet: model,
      lastUpdateId: updateId,
    }),

  reset: () =>
    set({
      ozet: BOS_VIDEO_STREAM_UI_MODEL,
      lastUpdateId: undefined,
    }),
}));
