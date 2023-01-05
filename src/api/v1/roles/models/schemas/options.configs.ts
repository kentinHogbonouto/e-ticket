export default {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc: any, ret: any) {
      delete ret._id;
    },
  },
};
