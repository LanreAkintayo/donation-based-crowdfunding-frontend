NEXT_PUBLIC_API_URL="https://donation-based-crowdfunding-backend.vercel.app"
NEXT_PUBLIC_API_URL="http://localhost:3000"
 

 Today

 Check and make sure that user is logged in.
 If user is logged in, they can create a campaign. if user is not logged in, they can still donate.

 Whether you are logged in or not, you can view stuff.



       <div className="grid grid-cols-1 gap-x-12 gap-y-10 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 md:grid-cols-3">
              {/* --- LEFT SIDE: DESCRIPTION --- */}
              <div className="md:col-span-1">
                <h2 className="text-lg font-bold leading-7 text-zinc-900">
                  Funding Details
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Set your funding goal, launch date, and campaign duration.
                </p>
                <div className="mt-4 rounded-md bg-orange-50 p-3 text-xs text-orange-800 border border-orange-100">
                  <p>
                    <strong>Note:</strong> You won&apos;t be able to change the
                    duration after you launch. Plan well!
                  </p>
                </div>
              </div>

              {/* --- RIGHT SIDE: INPUTS --- */}
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                  {/* 1. GOAL AMOUNT */}
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="goal"
                      className="block text-sm font-medium leading-6 text-zinc-700"
                    >
                      Goal Amount (USD)
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaDollarSign className="text-zinc-400" size={14} />
                      </div>
                      <input
                        type="number" // Changed to number for better UX
                        name="goal"
                        id="goal"
                        value={projectInfo.goal || ""}
                        onChange={handleOnChange}
                        className={`block w-full rounded-md border-0 py-2.5 pl-9 text-zinc-900 ring-1 ring-inset placeholder:text-zinc-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${
                          !isValidGoal && projectInfo.goal
                            ? "ring-red-300 focus:ring-red-500 bg-red-50"
                            : "ring-zinc-300 focus:ring-orange-600"
                        }`}
                        placeholder="e.g. 5000"
                      />
                    </div>
                    {!isValidGoal && projectInfo.goal && (
                      <p className="mt-2 flex items-center text-xs text-red-600">
                        <FaExclamationCircle className="mr-1" /> Invalid amount
                      </p>
                    )}
                  </div>

                  {/* 2. DURATION */}
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium leading-6 text-zinc-700"
                    >
                      Duration (Days)
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaClock className="text-zinc-400" size={14} />
                      </div>
                      <input
                        type="number"
                        name="duration"
                        id="duration"
                        onChange={handleOnChange}
                        className={`block w-full rounded-md border-0 py-2.5 pl-9 pr-12 text-zinc-900 ring-1 ring-inset placeholder:text-zinc-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${
                          !isValidDuration && projectInfo.duration
                            ? "ring-red-300 focus:ring-red-500 bg-red-50"
                            : "ring-zinc-300 focus:ring-orange-600"
                        }`}
                        placeholder="1 - 30"
                      />
                      {/* Suffix */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-zinc-500 sm:text-xs font-medium">
                          Days
                        </span>
                      </div>
                    </div>
                    {!isValidDuration && projectInfo.duration && (
                      <p className="mt-2 flex items-center text-xs text-red-600">
                        <FaExclamationCircle className="mr-1" /> Duration must
                        be between 1 and 30.
                      </p>
                    )}
                  </div>

                  {/* 3. LAUNCH DATE */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="launchDate"
                      className="block text-sm font-medium leading-6 text-zinc-700"
                    >
                      Launch Date
                    </label>
                    <div className="relative mt-2">
                      {/* Wrapper to force DatePicker to fill width */}
                      <div className="relative w-full">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                          <FaCalendarAlt className="text-zinc-400" size={14} />
                        </div>
                        <DatePicker
                          id="launchDate"
                          selected={projectInfo.launchDate}
                          onChange={(date) => {
                            /* Your logic */
                          }}
                          placeholderText="Select a start date"
                          className="block w-full rounded-md border-0 py-2.5 pl-10 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 cursor-pointer"
                          dateFormat="MMMM d, yyyy"
                          minDate={new Date()} // Prevent past dates
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">
                      This is when your campaign will become visible to the
                      public.
                    </p>
                  </div>
                </div>
              </div>
            </div> 